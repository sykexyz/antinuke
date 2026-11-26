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

// duplicate content detection for copy-paste spam and raid bots
const recentContents = new Map();
function isDuplicateSpam(gid, authorId, text, windowMs = 15000, maxDuplicates = 3) {
  const clean = (text || '').trim().toLowerCase();
  if (clean.length < 3) return false;
  const k = `${gid}:${authorId}`;
  const now = Date.now();
  const arr = (recentContents.get(k) || []).filter((item) => now - item.at < windowMs);
  arr.push({ text: clean, at: now });
  recentContents.set(k, arr);
  const count = arr.filter((item) => item.text === clean).length;
  return count >= maxDuplicates;
}
setInterval(() => recentContents.clear(), 10 * 60_000).unref();

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

// Purge messages sent by a specific user or bot in a channel
async function purgeUserMessages(channel, authorId, limit = 50) {
  if (!channel || !channel.messages) return;
  try {
    const fetched = await channel.messages.fetch({ limit }).catch(() => null);
    if (!fetched || fetched.size === 0) return;
    const twoWeeks = 14 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const userMsgs = fetched.filter((m) => m.author?.id === authorId && now - m.createdTimestamp < twoWeeks);
    if (userMsgs.size === 0) return;
    if (userMsgs.size === 1) {
      await userMsgs.first().delete().catch(() => {});
    } else if (channel.bulkDelete) {
      await channel.bulkDelete(userMsgs, true).catch(async () => {
        for (const m of userMsgs.values()) {
          await m.delete().catch(() => {});
        }
      });
    } else {
      for (const m of userMsgs.values()) {
        await m.delete().catch(() => {});
      }
    }
  } catch (e) {
    console.error('[purgeUserMessages]', e.message);
  }
}

// Delete thread announcement messages ("user started a thread: ...") in the parent channel
async function deleteThreadAnnouncements(parentChannel, threadId, threadName) {
  if (!parentChannel || !parentChannel.messages) return;
  try {
    const msgs = await parentChannel.messages.fetch({ limit: 25 }).catch(() => null);
    if (!msgs || msgs.size === 0) return;
    const tName = (threadName || '').toLowerCase();
    for (const m of msgs.values()) {
      const isThreadMsg =
        m.type === 18 || // MessageType.ThreadCreated
        m.type === 21 || // MessageType.ThreadStarterMessage
        m.id === threadId ||
        (m.thread && m.thread.id === threadId) ||
        (tName && m.content && m.content.toLowerCase().includes(tName));
      if (isThreadMsg) {
        await m.delete().catch(() => {});
      }
    }
  } catch (e) {
    console.error('[deleteThreadAnnouncements]', e.message);
  }
}

async function onMessage(msg) {
  if (!msg.guild || !msg.author) return;
  if (msg.author.id === msg.client.user.id) return;

  const gid = msg.guild.id;

  // 1. Thread interception if anti-thread is active
  if (on(gid, 'thread')) {
    // Intercept thread created announcement message in the parent channel
    if (msg.type === 18 || msg.type === 21) {
      const authorMember = msg.member || (await msg.guild.members.fetch(msg.author.id).catch(() => null));
      if (!authorMember || !isBypassed(authorMember)) {
        await msg.delete().catch(() => {});
        if (msg.thread) await msg.thread.delete('rize anti thread').catch(() => {});
        if (authorMember) await punish(authorMember, 'thread', 'created a thread');
        return;
      }
    }
    // Intercept messages inside unauthorized active threads
    if (msg.channel.isThread?.()) {
      const authorMember = msg.member || (await msg.guild.members.fetch(msg.author.id).catch(() => null));
      if (!authorMember || !isBypassed(authorMember)) {
        await msg.delete().catch(() => {});
        await msg.channel.delete('rize anti thread').catch(() => {});
        if (authorMember) await punish(authorMember, 'thread', 'active inside thread');
        return;
      }
    }
  }

  // Ensure member object is populated
  if (!msg.member && msg.author) {
    msg.member = await msg.guild.members.fetch(msg.author.id).catch(() => null);
  }

  tracker.message(msg);

  if (msg.member && isBypassed(msg.member)) return;

  const text = msg.content || '';

  // 2. Intercept unwhitelisted bots immediately if anti-botadd is active
  if (msg.author.bot) {
    const isWlBot = store.guild(gid).wl.bots.includes(msg.author.id);
    if (!isWlBot && on(gid, 'botadd')) {
      await msg.delete().catch(() => {});
      await purgeUserMessages(msg.channel, msg.author.id, 50).catch(() => {});
      if (msg.member) {
        await msg.member.ban({ reason: 'rize anti botadd: unwhitelisted bot active', deleteMessageSeconds: 604800 }).catch(async () => {
          await msg.member.kick('rize anti botadd: unwhitelisted bot active').catch(() => {});
        });
      } else {
        await msg.guild.members.ban(msg.author.id, { reason: 'rize anti botadd', deleteMessageSeconds: 604800 }).catch(() => {});
      }
      log(msg.guild, 'anti botadd', `Intercepted & banned unwhitelisted bot: ${msg.author.tag} (\`${msg.author.id}\`)`);
      return;
    }
  }

  const kill = async (rule, detail) => {
    await msg.delete().catch(() => {});
    await purgeUserMessages(msg.channel, msg.author.id, 50).catch(() => {});
    if (msg.member) {
      return punish(msg.member, rule, detail);
    } else {
      return msg.guild.members.ban(msg.author.id, { reason: `rize anti ${rule}`, deleteMessageSeconds: 604800 }).catch(() => {});
    }
  };

  // 3. Fast Anti-Spam: Rate bursts + Duplicate copy-paste flood
  if (on(gid, 'spam')) {
    const rateLimit = msg.author.bot ? 3 : 5;
    const isRate = hit(`spam:${gid}:${msg.author.id}`, 4000) >= rateLimit;
    const isDup = isDuplicateSpam(gid, msg.author.id, text, 15000, msg.author.bot ? 2 : 3);
    if (isRate || isDup) {
      return kill('spam', isDup ? 'duplicate copy-paste spam' : 'rapid message flood');
    }
  }

  // 4. Anti-Link
  if (on(gid, 'link')) {
    if (INVITE.test(text)) return kill('link', 'invite link');
    const lower = text.toLowerCase();
    const bad = BAD_DOMAINS.find((d) => lower.includes(d));
    if (bad) return kill('link', `flagged domain ${bad}`);
  }

  // 5. Anti-Mention
  const mentions = msg.mentions.users.size + msg.mentions.roles.size + (msg.mentions.everyone ? 5 : 0);
  if (on(gid, 'mention') && mentions >= 5) return kill('mention', `${mentions} mentions in one message`);

  // 6. Anti-Caps (Caps threshold: >= 10 letters, > 70% uppercase)
  if (on(gid, 'caps')) {
    const letters = text.replace(/[^a-z]/gi, '');
    if (letters.length >= 10 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.70) {
      return kill('caps', 'mostly caps');
    }
  }

  // 7. Anti-Zalgo
  if (on(gid, 'zalgo') && (text.match(ZALGO) || []).length >= 10) return kill('zalgo', 'zalgo text');

  // 8. Anti-Emoji
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
    await member.ban({ reason: 'rize anti botadd: unwhitelisted bot joined', deleteMessageSeconds: 604800 }).catch(async () => {
      await member.kick('rize anti botadd').catch(() => {});
    });
    if (who && !isBypassed(who)) punish(who, 'botadd', `added ${member.user.tag}`);
    else log(g, 'anti botadd', `banned unwhitelisted bot ${member.user.tag}`);
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

async function onThread(thread) {
  if (!thread || !thread.guild) return;
  const gid = thread.guild.id;
  const ownerId = thread.ownerId;
  const owner = ownerId ? await thread.guild.members.fetch(ownerId).catch(() => null) : null;
  const parent = thread.parent || (thread.parentId ? await thread.guild.channels.fetch(thread.parentId).catch(() => null) : null);

  // xtimeout'd people never get threads, whitelist or not
  if (ownerId && isX(gid, ownerId)) {
    await thread.delete('rize xtimeout').catch(() => {});
    if (parent) await deleteThreadAnnouncements(parent, thread.id, thread.name).catch(() => {});
    return;
  }

  if (owner) tracker.get(gid, owner.id).threads++;

  if (on(gid, 'thread')) {
    const bypassed = owner && isBypassed(owner);
    if (!bypassed) {
      await thread.delete('rize anti thread').catch(() => {});
      if (parent) {
        await deleteThreadAnnouncements(parent, thread.id, thread.name).catch(() => {});
      }
      if (owner) {
        await punish(owner, 'thread', `created thread #${thread.name}`);
      } else {
        log(thread.guild, 'anti thread', `deleted thread #${thread.name}. threads are off here.`);
      }
    }
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
  client.on('threadCreate', (t) => onThread(t).catch(console.error));
  client.on('webhooksUpdate', (c) => onWebhooks(c).catch(console.error));
  client.on('guildUpdate', (a, b) => onGuildUpdate(a, b).catch(console.error));
  client.on('voiceStateUpdate', onVoice);
}

module.exports = { wire };
