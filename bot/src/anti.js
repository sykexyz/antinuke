const { AuditLogEvent } = require('discord.js');
const store = require('./store');
const tracker = require('./tracker');
const { punish, isX } = require('./punish');
const { isBypassed } = require('./util');
const { log } = require('./logs');

const INVITE = /(discord\.(gg|io|me|li)|discord(app)?\.com\/invite|dsc\.gg)\/[\w-]+/i;
// short list of the usual suspects. add more as they show up
const BAD_DOMAINS = ['grabify.link', 'iplogger.org', 'iplogger.com', '2no.co', 'blasze.tk', 'discord-nitro.gift', 'discordgift.site', 'steamcommunlty.com', 'dlscord.gg', 'yip.su'];
const ZALGO = /[\u0300-\u036f\u0489\u1ab0-\u1aff\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g;
const EMOJI_RE = /(<a?:\w+:\d+>|\p{Extended_Pictographic})/gu;

const on = (gid, rule) => store.guild(gid).anti[rule]?.on;

// rolling counters keyed by whatever
const buckets = new Map();
function hit(k, windowMs) {
  const now = Date.now();
  const arr = (buckets.get(k) || []).filter((t) => now - t < windowMs);
  arr.push(now);
  buckets.set(k, arr);
  return arr.length;
}
setInterval(() => buckets.clear(), 10 * 60_000).unref();

// recent mention messages for ghost ping checks
const pings = new Map();

async function executor(guild, type, targetId) {
  try {
    const logs = await guild.fetchAuditLogs({ type, limit: 5 });
    const e = logs.entries.find((x) => Date.now() - x.createdTimestamp < 8000 && (!targetId || x.targetId === targetId));
    if (!e?.executor) return null;
    return guild.members.fetch(e.executor.id).catch(() => null);
  } catch {
    return null; // no view audit log perm, nothing we can do
  }
}

async function onMessage(msg) {
  if (!msg.guild || !msg.member) return;
  tracker.message(msg);
  if (msg.author.id === msg.client.user.id) return;
  if (isBypassed(msg.member)) return;

  const gid = msg.guild.id;
  const text = msg.content || '';
  const kill = async (rule, detail) => {
    await msg.delete().catch(() => {});
    return punish(msg.member, rule, detail);
  };

  if (on(gid, 'spam') && hit(`spam:${gid}:${msg.author.id}`, 5000) >= 6) return kill('spam', '6+ messages in 5s');

  if (on(gid, 'link')) {
    if (INVITE.test(text)) return kill('link', 'invite link');
    const lower = text.toLowerCase();
    const bad = BAD_DOMAINS.find((d) => lower.includes(d));
    if (bad) return kill('link', `flagged domain ${bad}`);
  }

  const mentions = msg.mentions.users.size + msg.mentions.roles.size + (msg.mentions.everyone ? 5 : 0);
  if (on(gid, 'mention') && mentions >= 5) return kill('mention', `${mentions} mentions in one message`);

  if (on(gid, 'caps')) {
    const letters = text.replace(/[^a-z]/gi, '');
    if (letters.length >= 12 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.75) return kill('caps', 'mostly caps');
  }

  if (on(gid, 'zalgo') && (text.match(ZALGO) || []).length >= 10) return kill('zalgo', 'zalgo text');

  if (on(gid, 'emoji') && (text.match(EMOJI_RE) || []).length >= 10) return kill('emoji', 'emoji flood');

  if (mentions > 0) pings.set(msg.id, { at: Date.now(), author: msg.author.id, count: mentions });
}

async function onDelete(msg) {
  const p = pings.get(msg.id);
  if (!p || !msg.guild) return;
  pings.delete(msg.id);
  if (!on(msg.guild.id, 'ghostping') || Date.now() - p.at > 60_000) return;
  const m = await msg.guild.members.fetch(p.author).catch(() => null);
  if (m && !isBypassed(m)) punish(m, 'ghostping', 'deleted a ping within a minute');
}

async function onEdit(before, after) {
  if (!after.guild || !pings.has(after.id)) return;
  const p = pings.get(after.id);
  const now = after.mentions.users.size + after.mentions.roles.size;
  if (now >= p.count || !on(after.guild.id, 'ghostping')) return;
  pings.delete(after.id);
  const m = after.member || (await after.guild.members.fetch(p.author).catch(() => null));
  if (m && !isBypassed(m)) punish(m, 'ghostping', 'edited the ping out');
}

const recentJoins = new Map();
async function onJoin(member) {
  const g = member.guild;
  tracker.get(g.id, member.id).joins++;

  if (member.user.bot) {
    if (!on(g.id, 'botadd') || store.guild(g.id).wl.bots.includes(member.id)) return;
    const who = await executor(g, AuditLogEvent.BotAdd, member.id);
    await member.kick('rize anti botadd').catch(() => {});
    if (who && !isBypassed(who)) punish(who, 'botadd', `added ${member.user.tag}`);
    else log(g, 'anti botadd', `kicked ${member.user.tag}, not whitelisted`);
    return;
  }

  // someone left mid-xtimeout and came back. nope
  if (isX(g.id, member.id)) member.timeout(5 * 60 * 60 * 1000, 'rize xtimeout - rejoined').catch(() => {});

  if (!on(g.id, 'raid')) return;
  const list = (recentJoins.get(g.id) || []).filter((j) => Date.now() - j.at < 10_000);
  list.push({ at: Date.now(), id: member.id });
  recentJoins.set(g.id, list);
  if (list.length >= 6) {
    log(g, 'raid detected', `${list.length} joins in 10s. handling everyone in the burst.`);
    for (const j of list.splice(0)) {
      const m = await g.members.fetch(j.id).catch(() => null);
      if (m && !isBypassed(m)) punish(m, 'raid', 'part of a join burst');
    }
  }
}

async function nukeCheck(guild, type, targetId, what) {
  if (!on(guild.id, 'nuke')) return;
  const who = await executor(guild, type, targetId);
  if (!who || isBypassed(who)) return;
  if (hit(`nuke:${guild.id}:${who.id}`, 15_000) >= 3) punish(who, 'nuke', `mass ${what} deletes`);
}

async function onThread(thread, isNew) {
  if (!isNew || !thread.guild) return;
  const owner = await thread.guild.members.fetch(thread.ownerId).catch(() => null);
  if (!owner) return;
  // xtimeout'd people never get threads, whitelist or not
  if (isX(thread.guild.id, owner.id)) return thread.delete('rize xtimeout').catch(() => {});
  tracker.get(thread.guild.id, owner.id).threads++;
  if (on(thread.guild.id, 'thread') && !isBypassed(owner)) {
    await thread.delete('rize anti thread').catch(() => {});
    log(thread.guild, 'anti thread', `deleted a thread from ${owner}. threads are off here.`);
  }
}

async function onWebhooks(channel) {
  const g = channel.guild;
  if (!on(g.id, 'webhook')) return;
  const who = await executor(g, AuditLogEvent.WebhookCreate);
  if (!who || isBypassed(who)) return;
  const hooks = await channel.fetchWebhooks().catch(() => null);
  if (hooks) for (const h of hooks.values()) if (h.owner?.id === who.id) await h.delete('rize anti webhook').catch(() => {});
  punish(who, 'webhook', `created a webhook in #${channel.name}`);
}

async function onGuildUpdate(before, after) {
  if (before.vanityURLCode === after.vanityURLCode || !on(after.id, 'vanity')) return;
  const who = await executor(after, AuditLogEvent.GuildUpdate);
  if (who && !isBypassed(who)) punish(who, 'vanity', `vanity changed ${before.vanityURLCode || 'none'} → ${after.vanityURLCode || 'none'}`);
}

function onVoice(oldS, newS) {
  const gid = newS.guild.id;
  const uid = newS.id;
  if (!oldS.channelId && newS.channelId) tracker.vcJoin(gid, uid);
  if (oldS.channelId && !newS.channelId) tracker.vcLeave(gid, uid);
  if (newS.channelId && isX(gid, uid)) newS.disconnect('rize xtimeout').catch(() => {});
}

function wire(client) {
  client.on('messageCreate', (m) => onMessage(m).catch(console.error));
  client.on('messageDelete', (m) => onDelete(m).catch(console.error));
  client.on('messageUpdate', (a, b) => onEdit(a, b).catch(console.error));
  client.on('guildMemberAdd', (m) => onJoin(m).catch(console.error));
  client.on('channelDelete', (c) => c.guild && nukeCheck(c.guild, AuditLogEvent.ChannelDelete, c.id, 'channel').catch(console.error));
  client.on('roleDelete', (r) => nukeCheck(r.guild, AuditLogEvent.RoleDelete, r.id, 'role').catch(console.error));
  client.on('guildBanAdd', (b) => nukeCheck(b.guild, AuditLogEvent.MemberBanAdd, b.user.id, 'ban').catch(console.error));
  client.on('threadCreate', (t, n) => onThread(t, n).catch(console.error));
  client.on('webhooksUpdate', (c) => onWebhooks(c).catch(console.error));
  client.on('guildUpdate', (a, b) => onGuildUpdate(a, b).catch(console.error));
  client.on('voiceStateUpdate', onVoice);
}

module.exports = { wire };
