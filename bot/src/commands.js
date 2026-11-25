const {
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits,
  ComponentType,
} = require('discord.js');
const store = require('./store');
const tracker = require('./tracker');
const { xtimeout, clearX, isX } = require('./punish');
const { log, ensureLogChannel, syncLogAccess } = require('./logs');
const { EMOJI, RED, GIF, flag, canConfigure, canPunish, topPos } = require('./util');

const ANTIS = store.ANTIS;
const antiChoices = ANTIS.map((a) => ({ name: a, value: a }));
const punChoices = ['kick', 'ban', 'xtimeout'].map((p) => ({ name: p, value: p }));

const defs = [
  new SlashCommandBuilder().setName('help').setDescription('Interactive Rize defense command console'),
  new SlashCommandBuilder().setName('prefix').setDescription('Configure custom message-command prefix')
    .addSubcommand((s) => s.setName('set').setDescription('Set new prefix').addStringOption((o) => o.setName('new').setDescription('1-5 characters').setRequired(true).setMaxLength(5))),
  new SlashCommandBuilder().setName('anti').setDescription('Toggle a protection module')
    .addStringOption((o) => o.setName('module').setDescription('Protection module').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('state').setDescription('Armed state').setRequired(true).addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' })),
  new SlashCommandBuilder().setName('punishment').setDescription('Configure automated sanction per rule')
    .addStringOption((o) => o.setName('module').setDescription('Protection module').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('type').setDescription('Sanction action').setRequired(true).addChoices(...punChoices)),
  new SlashCommandBuilder().setName('antinuke').setDescription('Inspect defense module status')
    .addSubcommand((s) => s.setName('stats').setDescription('Display armed protection status')),
  new SlashCommandBuilder().setName('whitelist').setDescription('Manage trusted roles, bots and users')
    .addSubcommandGroup((g) => g.setName('role').setDescription('Whitelist management role')
      .addSubcommand((s) => s.setName('add').setDescription('Designate config role').addRoleOption((o) => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Clear designated config role')))
    .addSubcommandGroup((g) => g.setName('bot').setDescription('Trusted bot integrations')
      .addSubcommand((s) => s.setName('add').setDescription('Exempt bot').addUserOption((o) => o.setName('bot').setDescription('Bot').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Revoke bot exemption').addUserOption((o) => o.setName('bot').setDescription('Bot').setRequired(true))))
    .addSubcommandGroup((g) => g.setName('user').setDescription('Trusted users')
      .addSubcommand((s) => s.setName('add').setDescription('Exempt user').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Revoke user exemption').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))))
    .addSubcommand((s) => s.setName('list').setDescription('View complete whitelist')),
  ...['kick', 'ban', 'xtimeout'].map((n) =>
    new SlashCommandBuilder().setName(n).setDescription(n === 'xtimeout' ? '5h timeout, voice lock and thread suppression' : `${n.toUpperCase()} a server member`)
      .addUserOption((o) => o.setName('user').setDescription('Target member').setRequired(true))
      .addStringOption((o) => o.setName('reason').setDescription('Reason'))),
  new SlashCommandBuilder().setName('unpunish').setDescription('Revoke an active X-Timeout sanction')
    .addUserOption((o) => o.setName('username').setDescription('Target member').setRequired(true)),
  new SlashCommandBuilder().setName('userinfo').setDescription('View a member security dossier')
    .addUserOption((o) => o.setName('user').setDescription('Target member')),
  new SlashCommandBuilder().setName('monitor').setDescription('View member activity telemetry')
    .addUserOption((o) => o.setName('user').setDescription('Target member').setRequired(true)),
  new SlashCommandBuilder().setName('setup').setDescription('Create or repair private #rize-logs'),
  new SlashCommandBuilder().setName('badges').setDescription('View badge eligibility and official claim steps'),
  new ContextMenuCommandBuilder().setName('Rize: Security Check').setType(ApplicationCommandType.User).setDMPermission(false),
  new ContextMenuCommandBuilder().setName('Rize: Scan Message').setType(ApplicationCommandType.Message).setDMPermission(false),
].map((c) => c.setDMPermission(false).toJSON());

const embed = (title, desc) => new EmbedBuilder()
  .setColor(RED)
  .setTitle(title)
  .setDescription(desc)
  .setFooter({ text: 'Rize Security • Tokyo Ghoul Protocol', iconURL: GIF })
  .setTimestamp();

const no = (ctx, why = 'You need the whitelist role, guild ownership, or a role above mine.') =>
  ctx.reply({ embeds: [embed('⛔ Access Denied', `[1;31m[ INSUFFICIENT CLEARANCE ][0m
${why}`)], ephemeral: true });

const fmtMs = (ms) => {
  const m = Math.floor(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

const makeMeter = (val, max = 10, len = 10) => {
  const filled = Math.min(len, Math.max(0, Math.round((val / max) * len)));
  return '▰'.repeat(filled) + '▱'.repeat(len - filled);
};

function helpPages(prefix = '!') {
  return [
    {
      title: '⛩️ Rize Security — Operations Console',
      badge: '01 / 05 • COMMAND INDEX',
      desc: [
        '```ansi',
        '\u001b[1;31m[ RIZE SECURITY BOT ]\u001b[0m  \u001b[2;37mTOKYO GHOUL PROTOCOL\u001b[0m',
        '\u001b[0;37mProtection, moderation and member telemetry.\u001b[0m',
        '```',
        '**Authority model**',
        '• Guild owner: full control.',
        '• Whitelist role: configuration access.',
        '• Role hierarchy: the acting moderator and Rize must outrank a target.',
        '',
        '**Core commands**',
        `${EMOJI} [1;31m/help[0m — open this command index`,
        `${EMOJI} [1;31m/setup[0m — provision private #rize-logs`,
        `${EMOJI} [1;31m/prefix set <new>[0m — set legacy prefix (current: \`${prefix}\`)`,
        `${EMOJI} [1;31m/badges[0m — badge eligibility and claim links`,
        '',
        '*Use the category buttons or Next / Previous to browse.*'
      ].join('\n')
    },
    {
      title: '🛡️ Rize Security — Defense Grid',
      badge: '02 / 05 • PROTECTION MODULES',
      desc: [
        '```ansi\n\u001b[1;31m[ ACTIVE DEFENSE VECTORS ]\u001b[0m\n```',
        '**Configure protections**',
        `${EMOJI} [1;31m/antinuke stats[0m — view enabled modules`,
        `${EMOJI} [1;31m/anti <module> <on|off>[0m — toggle a rule`,
        `${EMOJI} [1;31m/punishment <module> <type>[0m — choose kick, ban or xtimeout`,
        '',
        '**Detection families**',
        '• Raid, mass-delete, bot-add, webhook and vanity changes.',
        '• Spam, links, mentions, caps, zalgo, emoji floods and ghost pings.',
        '• Thread creation suppression.'
      ].join('\n')
    },
    {
      title: '📜 Rize Security — Whitelist Ledger',
      badge: '03 / 05 • TRUSTED ENTITIES',
      desc: [
        '```ansi\n\u001b[1;31m[ AUTHORIZED ENTITY REGISTRY ]\u001b[0m\n```',
        '**Configuration role**',
        `${EMOJI} [1;31m/whitelist role add <role>[0m — grant config access`,
        `${EMOJI} [1;31m/whitelist role remove[0m — clear config role`,
        '',
        '**Trusted bots and users**',
        `${EMOJI} [1;31m/whitelist bot add|remove <bot>[0m`,
        `${EMOJI} [1;31m/whitelist user add|remove <user>[0m`,
        `${EMOJI} [1;31m/whitelist list[0m — inspect the roster`
      ].join('\n')
    },
    {
      title: '🩸 Rize Security — X-Timeout',
      badge: '04 / 05 • SIGNATURE SANCTION',
      desc: [
        '```ansi\n\u001b[1;31m[ THREE-LAYER ISOLATION ]\u001b[0m\n```',
        '**What X-Timeout does**',
        '1. Applies a five-hour Discord timeout.',
        '2. Disconnects the member if they join voice.',
        '3. Removes threads they create while the sanction is active.',
        '',
        '**Enforcement**',
        `${EMOJI} [1;31m/xtimeout <user> [reason][0m — apply isolation`,
        `${EMOJI} [1;31m/unpunish <user>[0m — lift it (role must outrank target)`,
        `${EMOJI} [1;31m/kick <user> [reason][0m`,
        `${EMOJI} [1;31m/ban <user> [reason][0m`
      ].join('\n')
    },
    {
      title: '👁️ Rize Security — Member Intel',
      badge: '05 / 05 • TELEMETRY & CONTEXT MENUS',
      desc: [
        '```ansi\n\u001b[1;31m[ MEMBER TELEMETRY ]\u001b[0m\n```',
        `${EMOJI} [1;31m/monitor <user>[0m — message rate, voice time, violations`,
        `${EMOJI} [1;31m/userinfo [user][0m — member dossier and role position`,
        '',
        '**Right-click shortcuts**',
        `${EMOJI} Member → Apps → **Rize: Security Check**`,
        `${EMOJI} Message → Apps → **Rize: Scan Message**`,
        '',
        '*Only the person who opened this menu can use its navigation buttons.*'
      ].join('\n')
    }
  ];
}

function helpComponents(page, total) {
  const nav = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('rize_help_first').setLabel('⏮').setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
    new ButtonBuilder().setCustomId('rize_help_prev').setLabel('Previous').setStyle(ButtonStyle.Danger).setDisabled(page === 0),
    new ButtonBuilder().setCustomId('rize_help_page').setLabel(`${page + 1} / ${total}`).setStyle(ButtonStyle.Secondary).setDisabled(true),
    new ButtonBuilder().setCustomId('rize_help_next').setLabel('Next').setStyle(ButtonStyle.Danger).setDisabled(page === total - 1),
    new ButtonBuilder().setCustomId('rize_help_last').setLabel('⏭').setStyle(ButtonStyle.Secondary).setDisabled(page === total - 1)
  );
  const labels = ['Overview', 'Defense', 'Whitelist', 'X-Timeout', 'Member Intel'];
  const emojis = ['⛩️', '🛡️', '📜', '🩸', '👁️'];
  const cats = new ActionRowBuilder().addComponents(labels.map((label, idx) =>
    new ButtonBuilder().setCustomId(`rize_help_cat_${idx}`).setLabel(label).setEmoji(emojis[idx])
      .setStyle(page === idx ? ButtonStyle.Primary : ButtonStyle.Secondary)
  ));
  return [nav, cats];
}

const run = {
  async help(ctx) {
    const cfg = store.guild(ctx.guild.id);
    const pages = helpPages(cfg.prefix);
    let page = 0;
    const render = () => embed(pages[page].title, pages[page].desc)
      .setAuthor({ name: 'RIZE SECURITY MATRIX', iconURL: GIF })
      .setFooter({ text: `${pages[page].badge} • ${ctx.member.user.tag}`, iconURL: ctx.member.user.displayAvatarURL({ size: 128 }) });

    const message = await ctx.reply({ embeds: [render()], components: helpComponents(page, pages.length) });
    if (!message?.createMessageComponentCollector) return message;
    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 180000 });
    collector.on('collect', async (i) => {
      if (i.user.id !== ctx.member.id) return i.reply({ content: 'Only the person who opened this menu can navigate it.', ephemeral: true });
      if (i.customId === 'rize_help_first') page = 0;
      else if (i.customId === 'rize_help_prev') page = Math.max(0, page - 1);
      else if (i.customId === 'rize_help_next') page = Math.min(pages.length - 1, page + 1);
      else if (i.customId === 'rize_help_last') page = pages.length - 1;
      else if (i.customId.startsWith('rize_help_cat_')) page = Number(i.customId.slice('rize_help_cat_'.length));
      await i.update({ embeds: [render()], components: helpComponents(page, pages.length) }).catch(() => {});
    });
    collector.on('end', async () => {
      const disabled = helpComponents(page, pages.length);
      disabled.forEach((row) => row.components.forEach((button) => button.setDisabled(true)));
      await message.edit({ components: disabled }).catch(() => {});
    });
    return message;
  },

  async setup(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const ch = await ensureLogChannel(ctx.guild);
    const description = ch
      ? `Private audit vault is ready at ${ch}.\n\n\u001b[1;32m[ SECURE ]\u001b[0m Access follows the configured whitelist role.`
      : "Couldn't create the log channel. Rize needs Manage Channels.";
    return ctx.reply({ embeds: [embed('⛩️ Security Vault', description).setImage(GIF)] });
  },

  async prefix(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const p = ctx.str('new');
    if (!p || p.length > 5) return ctx.reply({ embeds: [embed('⚠️ Prefix Error', 'Prefix must be 1–5 characters long.')] });
    store.guild(ctx.guild.id).prefix = p;
    store.save();
    log(ctx.guild, 'prefix changed', `${ctx.member} set it to \`${p}\``);
    return ctx.reply({ embeds: [embed('🔧 Prefix Updated', `Message commands now start with \`${p}\`. Slash commands still work.`)] });
  },

  async anti(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const state = ctx.str('state');
    if (!ANTIS.includes(mod) || !['on', 'off'].includes(state)) return ctx.reply({ embeds: [embed('⚠️ Invalid Settings', `Use a valid module and on/off state.`)] });
    store.guild(ctx.guild.id).anti[mod].on = state === 'on';
    store.save();
    log(ctx.guild, 'config change', `${ctx.member} turned anti ${mod} ${state}`);
    const detail = `[1;31m[ ${state.toUpperCase()} ][0m\nPunishment: ${store.guild(ctx.guild.id).anti[mod].punish}`;
    return ctx.reply({ embeds: [embed(`🛡️ Defense Vector: anti ${mod}`, `${flag(state === 'on')} anti ${mod} is **${state}**\n\n${detail}`)] });
  },

  async punishment(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const type = ctx.str('type');
    if (!ANTIS.includes(mod) || !['kick', 'ban', 'xtimeout'].includes(type)) return ctx.reply({ embeds: [embed('⚠️ Invalid Settings', 'Choose a valid rule and sanction type.')] });
    store.guild(ctx.guild.id).anti[mod].punish = type;
    store.save();
    log(ctx.guild, 'config change', `${ctx.member} set anti ${mod} punishment to ${type}`);
    return ctx.reply({ embeds: [embed('⚖️ Sanction Protocol Updated', `Anti ${mod} will now respond with **${type.toUpperCase()}**.`)] });
  },

  async antinuke(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const enabled = ANTIS.filter((a) => cfg.anti[a].on).length;
    const pct = Math.round((enabled / ANTIS.length) * 100);
    const lines = ANTIS.map((a) => `${flag(cfg.anti[a].on)} \`anti ${a}\`  ·  \`${cfg.anti[a].punish}\``).join('\n');
    const body = `[1;31m[ DEFENSE GRID ][0m ${enabled}/${ANTIS.length} armed\n[${makeMeter(enabled, ANTIS.length, 12)}]\n\n${lines}`;
    return ctx.reply({ embeds: [embed('🛡️ Rize Defense Status', body).setThumbnail(GIF).setFooter({ text: `Coverage: ${pct}% • Tokyo Ghoul Protocol` })] });
  },

  async whitelist(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const group = ctx.group();
    const sub = ctx.sub();
    if (sub === 'list') {
      const role = cfg.wl.role ? `<@&${cfg.wl.role}>` : '*None*';
      const bots = cfg.wl.bots.map((id) => `<@${id}>`).join(' • ') || '*None*';
      const users = cfg.wl.users.map((id) => `<@${id}>`).join(' • ') || '*None*';
      const description = `**👑 Configuration role**\n${role}\n\n**🤖 Trusted bots (${cfg.wl.bots.length})**\n${bots}\n\n**👤 Exempt users (${cfg.wl.users.length})**\n${users}`;
      return ctx.reply({ embeds: [embed('📜 Whitelist Ledger', description)] });
    }
    if (group === 'role') {
      if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(ctx.guild.members.me)) return no(ctx, 'Only the owner or someone above Rize can change the whitelist role.');
      if (sub === 'add') {
        const role = ctx.role('role');
        if (!role) return ctx.reply({ embeds: [embed('⚠️ Role Required', 'Choose a role to authorize.')] });
        cfg.wl.role = role.id;
        await syncLogAccess(ctx.guild);
      } else cfg.wl.role = null;
      store.save();
      log(ctx.guild, 'whitelist', `${ctx.member} ${sub === 'add' ? `set role to <@&${cfg.wl.role}>` : 'cleared the role'}`);
      return ctx.reply({ embeds: [embed('📜 Configuration Role Updated', cfg.wl.role ? `<@&${cfg.wl.role}> can configure Rize now.` : 'Whitelist role cleared.')] });
    }
    const list = group === 'bot' ? cfg.wl.bots : cfg.wl.users;
    const target = ctx.user(group === 'bot' ? 'bot' : 'user');
    if (!target) return ctx.reply({ embeds: [embed('⚠️ Target Required', 'Choose an account to change.')] });
    if (group === 'bot' && !target.bot) return ctx.reply({ embeds: [embed('⚠️ Not a Bot', 'That account is not a bot.')] });
    const idx = list.indexOf(target.id);
    if (sub === 'add' && idx === -1) list.push(target.id);
    if (sub === 'remove' && idx !== -1) list.splice(idx, 1);
    store.save();
    log(ctx.guild, 'whitelist', `${ctx.member} ${sub === 'add' ? 'added' : 'removed'} ${target} (${group})`);
    return ctx.reply({ embeds: [embed(`📜 ${group === 'bot' ? 'Trusted Bot' : 'Trusted User'}`, `${target} ${sub === 'add' ? 'added to' : 'removed from'} the whitelist.`)] });
  },

  async kick(ctx) { return manual(ctx, 'kick'); },
  async ban(ctx) { return manual(ctx, 'ban'); },
  async xtimeout(ctx) { return manual(ctx, 'xtimeout'); },

  async unpunish(ctx) {
    const u = ctx.user('username');
    const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
    if (!m) return ctx.reply({ embeds: [embed('⚠️ Member Not Found', 'Target could not be found in this server.')] });
    if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(m)) return no(ctx, 'Your highest role must outrank the target.');
    if (!isX(ctx.guild.id, m.id)) return ctx.reply({ embeds: [embed('ℹ️ No Active Sanction', `${m} is not currently under X-Timeout.`)] });
    clearX(ctx.guild.id, m.id);
    await m.timeout(null, `unpunished by ${ctx.member.user.tag}`).catch(() => {});
    log(ctx.guild, 'unpunish', `${ctx.member} lifted the xtimeout on ${m}`);
    return ctx.reply({ embeds: [embed('🩸 X-Timeout Lifted', `${m} has been released from the active sanction.`)] });
  },

  async userinfo(ctx) {
    const u = ctx.user('user') || ctx.member.user;
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const v = tracker.violations(ctx.guild.id, u.id);
    const risk = Math.min(100, v.length * 20 + (isX(ctx.guild.id, u.id) ? 40 : 0));
    const label = risk >= 60 ? 'HIGH THREAT' : risk > 0 ? 'WATCHLIST' : 'NO RECORDED THREATS';
    const desc = `[1;31m[ ${label} ][0m  Risk index: ${risk}%\n[${makeMeter(risk, 100, 12)}]\n\n**Account:** ${u}  ·  \`${u.id}\`\n**Created:** <t:${Math.floor(u.createdTimestamp / 1000)}:R>\n**Joined:** ${m ? `<t:${Math.floor(m.joinedTimestamp / 1000)}:R>` : '—'}\n**Highest role:** ${m ? m.roles.highest : '—'}\n**Recorded violations:** ${v.length}\n**X-Timeout:** ${isX(ctx.guild.id, u.id) ? 'ACTIVE' : 'inactive'}\n**Account type:** ${u.bot ? 'Bot' : 'Member'}`;
    return ctx.reply({ embeds: [embed(`👤 Member Dossier: ${u.username}`, desc).setThumbnail(u.displayAvatarURL({ size: 256 }))] });
  },

  async monitor(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const u = ctx.user('user');
    if (!u) return ctx.reply({ embeds: [embed('⚠️ Member Required', 'Choose a member to monitor.')] });
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const s = tracker.get(ctx.guild.id, u.id);
    const v = tracker.violations(ctx.guild.id, u.id);
    const recent = v.slice(-5).reverse().map((x) => `• \`${x.rule}\` <t:${Math.floor(x.at / 1000)}:R>`).join('\n') || '*No violations recorded*';
    const rate = tracker.perMinute(ctx.guild.id, u.id);
    const desc = `[1;31m[ LIVE MEMBER TELEMETRY ][0m\n[${makeMeter(rate, 20, 12)}] ${rate} messages/min\n\n**Voice:** ${m?.voice?.channel ? m.voice.channel : 'Not connected'}\n**Session messages:** ${s.total}\n**Channels used:** ${s.channels.size}\n**Voice time:** ${fmtMs(tracker.vcTotal(ctx.guild.id, u.id))}\n**Threads created:** ${s.threads}\n**Joins observed:** ${s.joins}\n**Last activity:** ${s.lastSeen ? `<t:${Math.floor(s.lastSeen / 1000)}:R>` : '—'}\n**X-Timeout:** ${isX(ctx.guild.id, u.id) ? 'ACTIVE' : 'inactive'}\n\n**Recent violations (${v.length})**\n${recent}`;
    return ctx.reply({ embeds: [embed(`👁️ Member Telemetry: ${u.username}`, desc).setThumbnail(u.displayAvatarURL({ size: 256 }))] });
  },

  async badges(ctx) {
    const guildCount = ctx.guild.client.guilds.cache.size;
    const slashCount = defs.filter((item) => item.type === 1).length;
    const desc = [
      '```ansi',
      '\u001b[1;31m[ DISCORD APP STATUS ]\u001b[0m',
      '\u001b[0;37mWhat Rize has, and what still needs Discord approval.\u001b[0m',
      '```',
      '**Command support**',
      `• ${slashCount} slash commands and two right-click app commands are included in Rize’s command set.`,
      '• Discord controls which capability labels appear on the app profile.',
      '',
      '**App verification**',
      `• Rize is currently in ${guildCount} servers, based on this bot session.`,
      '• Verification is submitted by the application owner from the Developer Portal when Discord marks the app eligible. It cannot be added by bot code.',
      '',
      '**Profile and directory steps**',
      '• A support invite belongs in the app profile settings; it is not granted by a command.',
      '• Any source-code label on a bot directory must be requested and approved by that directory.',
      '• The Active Developer badge is retired and can’t currently be earned.',
      '',
      '*No badge is claimed or guaranteed here. Check the app’s Developer Portal for its current eligibility and available profile labels.*'
    ].join('\n');
    return ctx.reply({ embeds: [embed('🎖️ Rize App Status', desc).setThumbnail(GIF)] });
  }
};

async function manual(ctx, type) {
  const u = ctx.user('user');
  const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
  if (!m) return ctx.reply({ embeds: [embed('⚠️ Member Not Found', 'Target could not be found in this server.')] });
  const perm = { kick: PermissionFlagsBits.KickMembers, ban: PermissionFlagsBits.BanMembers, xtimeout: PermissionFlagsBits.ModerateMembers }[type];
  if (!ctx.member.permissions.has(perm) && !canConfigure(ctx.member)) return no(ctx);
  if (!canPunish(ctx.member, m)) return no(ctx, 'You and Rize must both outrank the target member.');
  const reason = ctx.str('reason') || 'No reason provided';
  try {
    if (type === 'kick') await m.kick(reason);
    else if (type === 'ban') await m.ban({ reason });
    else await xtimeout(m, reason);
  } catch (e) {
    return ctx.reply({ embeds: [embed('⚠️ Action Failed', e.message)] });
  }
  log(ctx.guild, `manual ${type}`, `${ctx.member} → ${m}\n**Reason:** ${reason}`);
  return ctx.reply({ embeds: [embed(`🩸 ${type.toUpperCase()} Executed`, `**Target:** ${m.user.tag}\n**Moderator:** ${ctx.member}\n**Reason:** ${reason}${type === 'xtimeout' ? '\n\nFive-hour timeout, voice disconnect and thread suppression engaged.' : ''}`)] });
}

async function runUserContext(i) {
  const target = i.targetUser;
  const member = await i.guild.members.fetch(target.id).catch(() => null);
  const violations = tracker.violations(i.guild.id, target.id);
  const active = isX(i.guild.id, target.id);
  const risk = Math.min(100, violations.length * 20 + (active ? 40 : 0));
  const desc = `**Threat index:** ${risk}%  [${makeMeter(risk, 100, 10)}]\n**Role:** ${member ? member.roles.highest : 'Not in server'}\n**Violations:** ${violations.length}\n**X-Timeout:** ${active ? 'ACTIVE' : 'inactive'}`;
  return i.reply({ embeds: [embed(`🔍 Security Check: ${target.username}`, desc).setThumbnail(target.displayAvatarURL({ size: 128 }))], ephemeral: true });
}

async function runMessageContext(i) {
  const msg = i.targetMessage;
  const content = msg.content || '';
  const links = /https?:\/\/\S+/i.test(content);
  const mentions = msg.mentions.users.size;
  const zalgo = /[\u0300-\u036f\u0489]{3,}/i.test(content);
  const desc = `**Author:** ${msg.author}\n**Channel:** <#${msg.channelId}>\n**Length:** ${content.length} characters\n**Links:** ${links ? 'Detected' : 'None'}\n**Mentions:** ${mentions}\n**Zalgo characters:** ${zalgo ? 'Detected' : 'None'}`;
  return i.reply({ embeds: [embed('📨 Message Threat Scan', desc)], ephemeral: true });
}

function fromSlash(i) {
  const o = i.options;
  return {
    raw: i,
    guild: i.guild,
    member: i.member,
    reply: async (p) => {
      if (i.replied || i.deferred) return i.followUp(p);
      const result = await i.reply({ ...p, fetchReply: true });
      return result || i.fetchReply().catch(() => null);
    },
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
    raw: msg,
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

module.exports = { defs, run, fromSlash, fromMessage, runUserContext, runMessageContext };
