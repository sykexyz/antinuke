const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('./store');
const tracker = require('./tracker');
const { xtimeout, clearX, isX } = require('./punish');
const { log, ensureLogChannel, syncLogAccess } = require('./logs');
const { EMOJI, RED, flag, canConfigure, canPunish, topPos } = require('./util');

const ANTIS = store.ANTIS;
const antiChoices = ANTIS.map((a) => ({ name: a, value: a }));
const punChoices = ['kick', 'ban', 'xtimeout'].map((p) => ({ name: p, value: p }));

// slash definitions
const defs = [
  new SlashCommandBuilder().setName('help').setDescription('everything rize can do'),
  new SlashCommandBuilder().setName('prefix').setDescription('message command prefix')
    .addSubcommand((s) => s.setName('set').setDescription('change it').addStringOption((o) => o.setName('new').setDescription('new prefix').setRequired(true).setMaxLength(5))),
  new SlashCommandBuilder().setName('anti').setDescription('turn a protection on or off')
    .addStringOption((o) => o.setName('module').setDescription('which one').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('state').setDescription('on or off').setRequired(true).addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' })),
  new SlashCommandBuilder().setName('punishment').setDescription('what happens when a rule trips')
    .addStringOption((o) => o.setName('module').setDescription('which anti').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('type').setDescription('kick, ban or xtimeout').setRequired(true).addChoices(...punChoices)),
  new SlashCommandBuilder().setName('antinuke').setDescription('protection status')
    .addSubcommand((s) => s.setName('stats').setDescription('what is on and off')),
  new SlashCommandBuilder().setName('whitelist').setDescription('who rize leaves alone')
    .addSubcommandGroup((g) => g.setName('role').setDescription('the config role')
      .addSubcommand((s) => s.setName('add').setDescription('set it').addRoleOption((o) => o.setName('role').setDescription('role').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('clear it')))
    .addSubcommandGroup((g) => g.setName('bot').setDescription('trusted bots')
      .addSubcommand((s) => s.setName('add').setDescription('trust a bot').addUserOption((o) => o.setName('bot').setDescription('bot').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('untrust a bot').addUserOption((o) => o.setName('bot').setDescription('bot').setRequired(true))))
    .addSubcommandGroup((g) => g.setName('user').setDescription('trusted users')
      .addSubcommand((s) => s.setName('add').setDescription('trust someone').addUserOption((o) => o.setName('user').setDescription('user').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('untrust someone').addUserOption((o) => o.setName('user').setDescription('user').setRequired(true))))
    .addSubcommand((s) => s.setName('list').setDescription('show the whitelist')),
  ...['kick', 'ban', 'xtimeout'].map((n) =>
    new SlashCommandBuilder().setName(n).setDescription(n === 'xtimeout' ? '5h timeout, no vc, no threads' : `${n} someone`)
      .addUserOption((o) => o.setName('user').setDescription('who').setRequired(true))
      .addStringOption((o) => o.setName('reason').setDescription('why'))),
  new SlashCommandBuilder().setName('unpunish').setDescription('lift an xtimeout')
    .addUserOption((o) => o.setName('username').setDescription('who').setRequired(true)),
  new SlashCommandBuilder().setName('userinfo').setDescription('who someone is here')
    .addUserOption((o) => o.setName('user').setDescription('who')),
  new SlashCommandBuilder().setName('monitor').setDescription('live activity for one member')
    .addUserOption((o) => o.setName('user').setDescription('who').setRequired(true)),
  new SlashCommandBuilder().setName('setup').setDescription('make or fix #rize-logs'),
].map((c) => c.setDMPermission(false).toJSON());

const HELP = [
  ['/help', 'this list'],
  ['/setup', 'make or fix #rize-logs'],
  ['/prefix set', 'change the message prefix'],
  ...ANTIS.map((a) => [`/anti ${a}`, 'on / off']),
  ['/punishment', 'kick, ban or xtimeout per rule'],
  ['/antinuke stats', 'see what is armed'],
  ['/whitelist role', 'who can configure me'],
  ['/whitelist bot', 'trusted bots'],
  ['/whitelist user', 'trusted users'],
  ['/whitelist list', 'show all of it'],
  ['/kick', 'kick someone'],
  ['/ban', 'ban someone'],
  ['/xtimeout', '5h mute, vc kicks, thread wipes'],
  ['/unpunish', 'lift an xtimeout'],
  ['/userinfo', 'member card'],
  ['/monitor', 'live activity'],
];

const embed = (title, desc) => new EmbedBuilder().setColor(RED).setTitle(title).setDescription(desc).setFooter({ text: 'Rize • protection done right' });
const no = (ctx, why = "you can't do that here. you need the whitelist role, ownership, or a role above mine.") => ctx.reply({ embeds: [embed('nope', why)], ephemeral: true });

const fmtMs = (ms) => {
  const m = Math.floor(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

const run = {
  async help(ctx) {
    const lines = HELP.map(([c, d]) => `${EMOJI} ${c} — ${d}`);
    const cfg = store.guild(ctx.guild.id);
    return ctx.reply({ embeds: [embed('Rize', lines.join('\n')).addFields({ name: 'prefix', value: `\`${cfg.prefix}\` for message commands, slash always works` })] });
  },

  async setup(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const ch = await ensureLogChannel(ctx.guild);
    return ctx.reply({ embeds: [embed('setup', ch ? `logs go to ${ch}` : "couldn't make the channel. I need Manage Channels.")] });
  },

  async prefix(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const p = ctx.str('new');
    if (!p || p.length > 5) return ctx.reply({ embeds: [embed('prefix', 'give me something 1–5 characters long')] });
    store.guild(ctx.guild.id).prefix = p;
    store.save();
    log(ctx.guild, 'prefix changed', `${ctx.member} set it to \`${p}\``);
    return ctx.reply({ embeds: [embed('prefix', `now \`${p}\``)] });
  },

  async anti(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const state = ctx.str('state');
    if (!ANTIS.includes(mod) || !['on', 'off'].includes(state)) return ctx.reply({ embeds: [embed('anti', `usage: anti <${ANTIS.join('|')}> <on|off>`)] });
    store.guild(ctx.guild.id).anti[mod].on = state === 'on';
    store.save();
    log(ctx.guild, 'config change', `${ctx.member} turned anti ${mod} **${state}**`);
    return ctx.reply({ embeds: [embed('anti ' + mod, `${flag(state === 'on')} anti ${mod} is ${state}`)] });
  },

  async punishment(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const type = ctx.str('type');
    if (!ANTIS.includes(mod) || !['kick', 'ban', 'xtimeout'].includes(type)) return ctx.reply({ embeds: [embed('punishment', 'usage: punishment <anti> <kick|ban|xtimeout>')] });
    store.guild(ctx.guild.id).anti[mod].punish = type;
    store.save();
    log(ctx.guild, 'config change', `${ctx.member} set anti ${mod} punishment to **${type}**`);
    return ctx.reply({ embeds: [embed('punishment', `anti ${mod} → ${type}`)] });
  },

  async antinuke(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const lines = ANTIS.map((a) => `${flag(cfg.anti[a].on)} anti ${a} · \`${cfg.anti[a].punish}\``);
    return ctx.reply({ embeds: [embed('protection status', lines.join('\n'))] });
  },

  async whitelist(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const group = ctx.group();
    const sub = ctx.sub();

    if (sub === 'list') {
      const r = cfg.wl.role ? `<@&${cfg.wl.role}>` : 'none';
      const b = cfg.wl.bots.map((id) => `<@${id}>`).join(', ') || 'none';
      const u = cfg.wl.users.map((id) => `<@${id}>`).join(', ') || 'none';
      return ctx.reply({ embeds: [embed('whitelist', `**role** ${r}\n**bots** ${b}\n**users** ${u}`)] });
    }

    if (group === 'role') {
      if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(ctx.guild.members.me)) return no(ctx, 'only the owner or someone above me can change the whitelist role.');
      if (sub === 'add') {
        const role = ctx.role('role');
        if (!role) return ctx.reply({ embeds: [embed('whitelist', 'which role?')] });
        cfg.wl.role = role.id;
        await syncLogAccess(ctx.guild);
      } else cfg.wl.role = null;
      store.save();
      log(ctx.guild, 'whitelist', `${ctx.member} ${sub === 'add' ? `set the role to <@&${cfg.wl.role}>` : 'cleared the role'}`);
      return ctx.reply({ embeds: [embed('whitelist role', cfg.wl.role ? `<@&${cfg.wl.role}> can configure me now` : 'cleared')] });
    }

    const list = group === 'bot' ? cfg.wl.bots : cfg.wl.users;
    const target = ctx.user(group === 'bot' ? 'bot' : 'user');
    if (!target) return ctx.reply({ embeds: [embed('whitelist', 'who?')] });
    if (group === 'bot' && !target.bot) return ctx.reply({ embeds: [embed('whitelist', "that's not a bot")] });
    const i = list.indexOf(target.id);
    if (sub === 'add' && i === -1) list.push(target.id);
    if (sub === 'remove' && i !== -1) list.splice(i, 1);
    store.save();
    log(ctx.guild, 'whitelist', `${ctx.member} ${sub === 'add' ? 'added' : 'removed'} ${target} (${group})`);
    return ctx.reply({ embeds: [embed(`whitelist ${group}`, `${target} ${sub === 'add' ? 'added' : 'removed'}`)] });
  },

  async kick(ctx) { return manual(ctx, 'kick'); },
  async ban(ctx) { return manual(ctx, 'ban'); },
  async xtimeout(ctx) { return manual(ctx, 'xtimeout'); },

  async unpunish(ctx) {
    const u = ctx.user('username');
    const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
    if (!m) return ctx.reply({ embeds: [embed('unpunish', 'who?')] });
    if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(m)) return no(ctx, 'you need a role higher than theirs.');
    if (!isX(ctx.guild.id, m.id)) return ctx.reply({ embeds: [embed('unpunish', `${m} isn't under xtimeout`)] });
    clearX(ctx.guild.id, m.id);
    await m.timeout(null, `unpunished by ${ctx.member.user.tag}`).catch(() => {});
    log(ctx.guild, 'unpunish', `${ctx.member} lifted the xtimeout on ${m}`);
    return ctx.reply({ embeds: [embed('unpunish', `${m} is free`)] });
  },

  async userinfo(ctx) {
    const u = ctx.user('user') || ctx.member.user;
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const v = tracker.violations(ctx.guild.id, u.id);
    const e = embed(u.tag, `${u} · \`${u.id}\``)
      .setThumbnail(u.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'created', value: `<t:${Math.floor(u.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'joined', value: m ? `<t:${Math.floor(m.joinedTimestamp / 1000)}:R>` : '—', inline: true },
        { name: 'top role', value: m ? `${m.roles.highest}` : '—', inline: true },
        { name: 'violations', value: String(v.length), inline: true },
        { name: 'xtimeout', value: isX(ctx.guild.id, u.id) ? 'yes' : 'no', inline: true },
        { name: 'bot', value: u.bot ? 'yes' : 'no', inline: true },
      );
    return ctx.reply({ embeds: [e] });
  },

  async monitor(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const u = ctx.user('user');
    if (!u) return ctx.reply({ embeds: [embed('monitor', 'who?')] });
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const s = tracker.get(ctx.guild.id, u.id);
    const v = tracker.violations(ctx.guild.id, u.id);
    const lastV = v.slice(-5).reverse().map((x) => `\`${x.rule}\` <t:${Math.floor(x.at / 1000)}:R>`).join('\n') || 'clean';
    const e = embed(`watching ${u.username}`, m?.voice?.channel ? `in voice: ${m.voice.channel}` : 'not in voice')
      .setThumbnail(u.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: 'msgs / min', value: String(tracker.perMinute(ctx.guild.id, u.id)), inline: true },
        { name: 'msgs (session)', value: String(s.total), inline: true },
        { name: 'channels used', value: String(s.channels.size), inline: true },
        { name: 'vc time', value: fmtMs(tracker.vcTotal(ctx.guild.id, u.id)), inline: true },
        { name: 'threads made', value: String(s.threads), inline: true },
        { name: 'joins seen', value: String(s.joins), inline: true },
        { name: 'last seen', value: s.lastSeen ? `<t:${Math.floor(s.lastSeen / 1000)}:R>` : '—', inline: true },
        { name: 'xtimeout', value: isX(ctx.guild.id, u.id) ? 'active' : 'no', inline: true },
        { name: `recent violations (${v.length})`, value: lastV },
      );
    return ctx.reply({ embeds: [e] });
  },
};

async function manual(ctx, type) {
  const u = ctx.user('user');
  const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
  if (!m) return ctx.reply({ embeds: [embed(type, 'who?')] });
  const perm = { kick: PermissionFlagsBits.KickMembers, ban: PermissionFlagsBits.BanMembers, xtimeout: PermissionFlagsBits.ModerateMembers }[type];
  if (!ctx.member.permissions.has(perm) && !canConfigure(ctx.member)) return no(ctx);
  if (!canPunish(ctx.member, m)) return no(ctx, 'you (and I) need to be above them.');
  const reason = ctx.str('reason') || 'no reason';
  try {
    if (type === 'kick') await m.kick(reason);
    else if (type === 'ban') await m.ban({ reason });
    else await xtimeout(m, reason);
  } catch (e) {
    return ctx.reply({ embeds: [embed(type, `didn't work: ${e.message}`)] });
  }
  log(ctx.guild, `manual ${type}`, `${ctx.member} → ${m}\n**reason** ${reason}`);
  return ctx.reply({ embeds: [embed(type, `${m.user.tag} handled. ${type === 'xtimeout' ? '5h, no vc, no threads.' : ''}`)] });
}

function fromSlash(i) {
  const o = i.options;
  return {
    guild: i.guild,
    member: i.member,
    reply: (p) => (i.replied || i.deferred ? i.followUp(p) : i.reply(p)),
    str: (n) => o.getString(n),
    user: (n) => o.getUser(n),
    role: (n) => o.getRole(n),
    sub: () => o.getSubcommand(false),
    group: () => o.getSubcommandGroup(false),
  };
}

function fromMessage(msg, name, args) {
  const users = [...msg.mentions.users.values()];
  const roles = [...msg.mentions.roles.values()];
  const named = {};
  if (name === 'prefix') named.new = args[1];
  if (name === 'anti') [named.module, named.state] = args;
  if (name === 'punishment') [named.module, named.type] = args;
  if (['kick', 'ban', 'xtimeout'].includes(name)) named.reason = args.slice(1).join(' ') || null;
  const isWl = name === 'whitelist';
  return {
    guild: msg.guild,
    member: msg.member,
    reply: (p) => msg.reply({ ...p, ephemeral: undefined, allowedMentions: { repliedUser: false } }),
    str: (n) => named[n] ?? null,
    user: () => users[0] || null,
    role: () => roles[0] || null,
    sub: () => (isWl ? (args[0] === 'list' ? 'list' : args[1]) : args[0]),
    group: () => (isWl && args[0] !== 'list' ? args[0] : null),
  };
}

module.exports = { defs, run, fromSlash, fromMessage };
