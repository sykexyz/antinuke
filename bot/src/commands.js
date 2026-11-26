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
const {
  EMOJI,
  EMOJI_SHIELD,
  EMOJI_ON,
  EMOJI_OFF,
  EMOJI_RAID,
  EMOJI_BELL,
  EMOJI_STATS,
  EMOJI_GEAR,
  RED,
  GIF,
  flag,
  canConfigure,
  canPunish,
  topPos,
} = require('./util');

const ANTIS = store.ANTIS;
const antiChoices = ANTIS.map((a) => ({ name: a, value: a }));
const punChoices = ['kick', 'ban', 'xtimeout'].map((p) => ({ name: p, value: p }));

const defs = [
  new SlashCommandBuilder().setName('help').setDescription('View Rize Bot commands and help menu'),
  new SlashCommandBuilder().setName('commands').setDescription('View Rize Bot commands and help menu'),
  new SlashCommandBuilder().setName('prefix').setDescription('Configure custom message-command prefix')
    .addSubcommand((s) => s.setName('set').setDescription('Set new prefix').addStringOption((o) => o.setName('new').setDescription('1-5 characters').setRequired(true).setMaxLength(5))),
  new SlashCommandBuilder().setName('anti').setDescription('Toggle a protection module on or off')
    .addStringOption((o) => o.setName('module').setDescription('Protection module').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('state').setDescription('Status').setRequired(true).addChoices({ name: 'on', value: 'on' }, { name: 'off', value: 'off' })),
  new SlashCommandBuilder().setName('punishment').setDescription('Configure punishment action for a module')
    .addStringOption((o) => o.setName('module').setDescription('Protection module').setRequired(true).addChoices(...antiChoices))
    .addStringOption((o) => o.setName('type').setDescription('Action').setRequired(true).addChoices(...punChoices)),
  new SlashCommandBuilder().setName('antinuke').setDescription('Inspect server protection status')
    .addSubcommand((s) => s.setName('stats').setDescription('Display active protection modules')),
  new SlashCommandBuilder().setName('whitelist').setDescription('Manage trusted roles, bots, and users')
    .addSubcommandGroup((g) => g.setName('role').setDescription('Manage whitelist role')
      .addSubcommand((s) => s.setName('add').setDescription('Designate config role').addRoleOption((o) => o.setName('role').setDescription('Role').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Clear designated config role')))
    .addSubcommandGroup((g) => g.setName('bot').setDescription('Manage trusted bots')
      .addSubcommand((s) => s.setName('add').setDescription('Exempt bot').addUserOption((o) => o.setName('bot').setDescription('Bot').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Revoke bot exemption').addUserOption((o) => o.setName('bot').setDescription('Bot').setRequired(true))))
    .addSubcommandGroup((g) => g.setName('user').setDescription('Manage trusted users')
      .addSubcommand((s) => s.setName('add').setDescription('Exempt user').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true)))
      .addSubcommand((s) => s.setName('remove').setDescription('Revoke user exemption').addUserOption((o) => o.setName('user').setDescription('User').setRequired(true))))
    .addSubcommand((s) => s.setName('list').setDescription('View complete whitelist')),
  ...['kick', 'ban', 'xtimeout'].map((n) =>
    new SlashCommandBuilder().setName(n).setDescription(n === 'xtimeout' ? 'Apply 5-hour timeout, voice kick, and thread block' : `${n.toUpperCase()} a server member`)
      .addUserOption((o) => o.setName('user').setDescription('Target member').setRequired(true))
      .addStringOption((o) => o.setName('reason').setDescription('Reason'))),
  new SlashCommandBuilder().setName('unpunish').setDescription('Remove an active X-Timeout from a member')
    .addUserOption((o) => o.setName('username').setDescription('Target member').setRequired(true)),
  new SlashCommandBuilder().setName('userinfo').setDescription('View member account details and status')
    .addUserOption((o) => o.setName('user').setDescription('Target member')),
  new SlashCommandBuilder().setName('monitor').setDescription('View member message speed and activity')
    .addUserOption((o) => o.setName('user').setDescription('Target member').setRequired(true)),
  new SlashCommandBuilder().setName('setup').setDescription('Create or verify private #rize-logs'),
  new SlashCommandBuilder().setName('badges').setDescription('View bot status and verification info'),
  new ContextMenuCommandBuilder().setName('Rize: Security Check').setType(ApplicationCommandType.User).setDMPermission(false),
  new ContextMenuCommandBuilder().setName('Rize: Scan Message').setType(ApplicationCommandType.Message).setDMPermission(false),
].map((c) => c.setDMPermission(false).toJSON());

const embed = (title, desc) => new EmbedBuilder()
  .setColor(RED)
  .setTitle(title)
  .setDescription(desc)
  .setFooter({ text: 'RizeSec • Server Protection', iconURL: GIF })
  .setTimestamp();

const no = (ctx, why = 'You need the whitelist role, server owner status, or a role above Rize.') =>
  ctx.reply({
    embeds: [
      embed(
        `${EMOJI_OFF} Access Denied`,
        `${why}\n\nMake sure your role is placed above Rize in Server Settings.`
      )
    ],
    ephemeral: true,
  });

const fmtMs = (ms) => {
  const m = Math.floor(ms / 60000);
  return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

// Exactly 4 commands displayed per page across 5 categories
const HELP_PAGES = [
  {
    category: 'Server Protection',
    buttonLabel: 'Protection',
    title: 'Protection Commands',
    commands: [
      {
        name: '/anti <module> <on|off>',
        desc: 'Turn an anti-abuse module on or off for this server.',
        usage: '/anti spam on',
        emoji: EMOJI_SHIELD,
      },
      {
        name: '/antinuke stats',
        desc: 'View all active protection modules and their current punishment.',
        usage: '/antinuke stats',
        emoji: EMOJI_SHIELD,
      },
      {
        name: '/punishment <module> <action>',
        desc: 'Set punishment action (kick, ban, xtimeout) for a module.',
        usage: '/punishment spam xtimeout',
        emoji: EMOJI_RAID,
      },
      {
        name: '/setup',
        desc: 'Create or verify the private #rize-logs channel.',
        usage: '/setup',
        emoji: EMOJI_BELL,
      },
    ],
  },
  {
    category: 'Whitelist Management',
    buttonLabel: 'Whitelist',
    title: 'Whitelist Commands',
    commands: [
      {
        name: '/whitelist role <add|remove>',
        desc: 'Set or clear the server role allowed to manage Rize.',
        usage: '/whitelist role add role:@Moderator',
        emoji: EMOJI_GEAR,
      },
      {
        name: '/whitelist bot <add|remove>',
        desc: 'Allow a trusted bot to bypass anti-bot and spam filters.',
        usage: '/whitelist bot add bot:@MusicBot',
        emoji: EMOJI_ON,
      },
      {
        name: '/whitelist user <add|remove>',
        desc: 'Allow a trusted member to bypass server protections.',
        usage: '/whitelist user add user:@Friend',
        emoji: EMOJI_ON,
      },
      {
        name: '/whitelist list',
        desc: 'List all trusted roles, bots, and users for this server.',
        usage: '/whitelist list',
        emoji: EMOJI_ON,
      },
    ],
  },
  {
    category: 'Member Moderation',
    buttonLabel: 'Moderation',
    title: 'Moderation Commands',
    commands: [
      {
        name: '/xtimeout <user> [reason]',
        desc: 'Apply a 5-hour timeout, disconnect from voice, and block threads.',
        usage: '/xtimeout user:@badactor reason:spamming',
        emoji: EMOJI_RAID,
      },
      {
        name: '/unpunish <username>',
        desc: 'Remove an active timeout and restore member access.',
        usage: '/unpunish username:@member',
        emoji: EMOJI_ON,
      },
      {
        name: '/kick <user> [reason]',
        desc: 'Kick a member from the server.',
        usage: '/kick user:@member reason:breaking rules',
        emoji: EMOJI_RAID,
      },
      {
        name: '/ban <user> [reason]',
        desc: 'Ban a member and remove recent messages.',
        usage: '/ban user:@raider reason:raiding server',
        emoji: EMOJI_RAID,
      },
    ],
  },
  {
    category: 'Settings & Info',
    buttonLabel: 'Settings',
    title: 'Settings & Info',
    commands: [
      {
        name: '/monitor <user>',
        desc: 'View member message rate, voice time, and recent violations.',
        usage: '/monitor user:@member',
        emoji: EMOJI_STATS,
      },
      {
        name: '/userinfo [user]',
        desc: 'Check member account age, join date, and role rank.',
        usage: '/userinfo user:@member',
        emoji: EMOJI_STATS,
      },
      {
        name: '/prefix set <new>',
        desc: 'Change the custom prefix for message commands.',
        usage: '/prefix set new:!',
        emoji: EMOJI_GEAR,
      },
      {
        name: '/badges',
        desc: 'View Rize Bot server count and Discord verification info.',
        usage: '/badges',
        emoji: EMOJI_SHIELD,
      },
    ],
  },
  {
    category: 'Apps & Shortcuts',
    buttonLabel: 'Apps',
    title: 'Apps & Shortcuts',
    commands: [
      {
        name: 'Rize: Security Check',
        desc: 'Right-click any member → Apps to view violations and role rank.',
        usage: 'Right-click user → Apps → Rize: Security Check',
        emoji: EMOJI_STATS,
      },
      {
        name: 'Rize: Scan Message',
        desc: 'Right-click any message → Apps to scan for spam and invite links.',
        usage: 'Right-click message → Apps → Rize: Scan Message',
        emoji: EMOJI_SHIELD,
      },
      {
        name: '/help (or /commands)',
        desc: 'Open this interactive command browser anytime.',
        usage: '/help',
        emoji: EMOJI,
      },
      {
        name: 'Message Commands',
        desc: 'Run commands using the server prefix (e.g. !help, !anti).',
        usage: '!help or !antinuke stats',
        emoji: EMOJI_GEAR,
      },
    ],
  },
];

function renderHelpEmbed(pageIdx, prefix = '!') {
  const p = HELP_PAGES[pageIdx];
  const items = p.commands
    .map((c) => {
      const usageFormatted = c.usage.replace(/!/g, prefix);
      return [
        `**${c.emoji} \`${c.name}\`**`,
        `> ${c.desc}`,
        `> \`Usage:\` \`${usageFormatted}\``,
      ].join('\n');
    })
    .join('\n\n');

  const desc = [
    `**${p.category}** • 4 commands shown`,
    '',
    items,
    '',
    `*Use the Next and Previous buttons below to switch pages.*`,
  ].join('\n');

  return new EmbedBuilder()
    .setColor(RED)
    .setTitle(`${p.title}`)
    .setDescription(desc)
    .setThumbnail(GIF)
    .setFooter({ text: `Page ${pageIdx + 1} of ${HELP_PAGES.length} • RizeSec`, iconURL: GIF })
    .setTimestamp();
}

function helpComponents(pageIdx, total) {
  const navRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('rize_help_prev')
      .setLabel('◀ Previous')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(pageIdx === 0),
    new ButtonBuilder()
      .setCustomId('rize_help_counter')
      .setLabel(`Page ${pageIdx + 1} of ${total}`)
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true),
    new ButtonBuilder()
      .setCustomId('rize_help_next')
      .setLabel('Next ▶')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(pageIdx === total - 1)
  );

  const catRow = new ActionRowBuilder().addComponents(
    HELP_PAGES.map((cat, idx) =>
      new ButtonBuilder()
        .setCustomId(`rize_help_cat_${idx}`)
        .setLabel(cat.buttonLabel)
        .setStyle(pageIdx === idx ? ButtonStyle.Primary : ButtonStyle.Secondary)
    )
  );

  return [navRow, catRow];
}

const run = {
  async help(ctx) {
    const cfg = store.guild(ctx.guild.id);
    let page = 0;
    const total = HELP_PAGES.length;

    const render = () => renderHelpEmbed(page, cfg.prefix || '!');
    const rows = () => helpComponents(page, total);

    const message = await ctx.reply({ embeds: [render()], components: rows() });
    if (!message?.createMessageComponentCollector) return message;

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 180000,
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== ctx.member.id) {
        return i.reply({ content: 'Only the person who ran this command can use the buttons.', ephemeral: true });
      }
      if (i.customId === 'rize_help_prev') {
        page = Math.max(0, page - 1);
      } else if (i.customId === 'rize_help_next') {
        page = Math.min(total - 1, page + 1);
      } else if (i.customId.startsWith('rize_help_cat_')) {
        const catIdx = Number(i.customId.slice('rize_help_cat_'.length));
        if (!isNaN(catIdx) && catIdx >= 0 && catIdx < total) {
          page = catIdx;
        }
      }
      await i.update({ embeds: [render()], components: rows() }).catch(() => {});
    });

    collector.on('end', async () => {
      const disabled = rows();
      disabled.forEach((row) => row.components.forEach((btn) => btn.setDisabled(true)));
      await message.edit({ components: disabled }).catch(() => {});
    });

    return message;
  },

  async setup(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const ch = await ensureLogChannel(ctx.guild);
    const desc = ch
      ? `${EMOJI_ON} Log channel is ready at ${ch}.\n\nOnly server managers and the whitelist role can view it.`
      : `${EMOJI_OFF} Could not create the log channel. Please ensure Rize has the Manage Channels permission.`;
    return ctx.reply({ embeds: [embed(`${EMOJI_BELL} Logs Setup`, desc).setImage(GIF)] });
  },

  async prefix(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const p = ctx.str('new');
    if (!p || p.length > 5) {
      return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Invalid Prefix`, 'The prefix must be 1 to 5 characters long.')] });
    }
    store.guild(ctx.guild.id).prefix = p;
    store.save();
    log(ctx.guild, 'prefix changed', `${ctx.member} set message prefix to \`${p}\``);
    return ctx.reply({
      embeds: [
        embed(
          `${EMOJI_GEAR} Prefix Updated`,
          `Message commands now start with \`${p}\` (e.g. \`${p}help\`).\nSlash commands still work anytime with \`/\`.`
        )
      ]
    });
  },

  async anti(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const state = ctx.str('state');
    if (!ANTIS.includes(mod) || !['on', 'off'].includes(state)) {
      return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Invalid Module`, 'Please select a valid protection module and on/off state.')] });
    }
    const isArmed = state === 'on';
    store.guild(ctx.guild.id).anti[mod].on = isArmed;
    store.save();
    log(ctx.guild, 'protection updated', `${ctx.member} turned anti ${mod} ${state}`);
    const p = store.guild(ctx.guild.id).anti[mod].punish;
    const statusIcon = isArmed ? EMOJI_ON : EMOJI_OFF;
    return ctx.reply({
      embeds: [
        embed(
          `${EMOJI_SHIELD} Protection Updated`,
          `${statusIcon} **anti ${mod}** is now **${state.toUpperCase()}**.\n${EMOJI_RAID} Action on violation: \`${p}\``
        )
      ]
    });
  },

  async punishment(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const mod = ctx.str('module');
    const type = ctx.str('type');
    if (!ANTIS.includes(mod) || !['kick', 'ban', 'xtimeout'].includes(type)) {
      return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Invalid Settings`, 'Choose a valid protection module and action.')] });
    }
    store.guild(ctx.guild.id).anti[mod].punish = type;
    store.save();
    log(ctx.guild, 'punishment updated', `${ctx.member} set anti ${mod} action to ${type}`);
    return ctx.reply({
      embeds: [
        embed(
          `${EMOJI_RAID} Punishment Updated`,
          `When **anti ${mod}** is triggered, Rize will **${type.toUpperCase()}** the member.`
        )
      ]
    });
  },

  async antinuke(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const enabled = ANTIS.filter((a) => cfg.anti[a].on).length;
    const pct = Math.round((enabled / ANTIS.length) * 100);

    const lines = ANTIS.map((a) => {
      const isArmed = cfg.anti[a].on;
      const statusIcon = isArmed ? EMOJI_ON : EMOJI_OFF;
      return `${statusIcon} **anti ${a}**  ·  action: \`${cfg.anti[a].punish}\``;
    }).join('\n');

    const desc = [
      `**Active Protections:** ${enabled} / ${ANTIS.length} enabled (${pct}%)`,
      '',
      lines,
      '',
      `*Use \`/anti <module> <on|off>\` to toggle or \`/punishment <module> <action>\` to change action.*`
    ].join('\n');

    return ctx.reply({
      embeds: [
        embed(`${EMOJI_SHIELD} Server Protection Status`, desc)
          .setThumbnail(GIF)
          .setFooter({ text: `RizeSec • ${enabled}/${ANTIS.length} Protections Active`, iconURL: GIF })
      ]
    });
  },

  async whitelist(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const cfg = store.guild(ctx.guild.id);
    const group = ctx.group();
    const sub = ctx.sub();

    if (sub === 'list') {
      const role = cfg.wl.role ? `<@&${cfg.wl.role}>` : '*None configured*';
      const bots = cfg.wl.bots.length ? cfg.wl.bots.map((id) => `<@${id}>`).join(' • ') : '*No trusted bots*';
      const users = cfg.wl.users.length ? cfg.wl.users.map((id) => `<@${id}>`).join(' • ') : '*No trusted users*';
      const desc = [
        `### ${EMOJI_GEAR} Whitelist Role`,
        `${role}`,
        `*(Members with this role can manage Rize settings)*`,
        '',
        `### ${EMOJI_ON} Trusted Bots (${cfg.wl.bots.length})`,
        `${bots}`,
        '',
        `### ${EMOJI_ON} Trusted Users (${cfg.wl.users.length})`,
        `${users}`,
      ].join('\n');
      return ctx.reply({ embeds: [embed(`${EMOJI_SHIELD} Server Whitelist`, desc)] });
    }

    if (group === 'role') {
      if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(ctx.guild.members.me)) {
        return no(ctx, 'Only the server owner or someone with a role higher than Rize can set the whitelist role.');
      }
      if (sub === 'add') {
        const role = ctx.role('role');
        if (!role) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Role Required`, 'Please select a valid role.')] });
        cfg.wl.role = role.id;
        await syncLogAccess(ctx.guild);
      } else {
        cfg.wl.role = null;
      }
      store.save();
      log(ctx.guild, 'whitelist updated', `${ctx.member} ${sub === 'add' ? `set whitelist role to <@&${cfg.wl.role}>` : 'cleared the whitelist role'}`);
      return ctx.reply({
        embeds: [
          embed(
            `${EMOJI_GEAR} Whitelist Role Updated`,
            cfg.wl.role ? `<@&${cfg.wl.role}> can now configure Rize.` : 'The whitelist role has been cleared.'
          )
        ]
      });
    }

    const list = group === 'bot' ? cfg.wl.bots : cfg.wl.users;
    const target = ctx.user(group === 'bot' ? 'bot' : 'user');
    if (!target) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Missing Target`, 'Please mention an account.')] });
    if (group === 'bot' && !target.bot) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Not A Bot`, 'That user is not a bot account.')] });

    const idx = list.indexOf(target.id);
    if (sub === 'add' && idx === -1) list.push(target.id);
    if (sub === 'remove' && idx !== -1) list.splice(idx, 1);
    store.save();

    log(ctx.guild, 'whitelist updated', `${ctx.member} ${sub === 'add' ? 'added' : 'removed'} ${target} (${group})`);
    return ctx.reply({
      embeds: [
        embed(
          `${EMOJI_ON} Whitelist Updated`,
          `${target} was ${sub === 'add' ? 'added to' : 'removed from'} the trusted ${group} list.`
        )
      ]
    });
  },

  async kick(ctx) { return manual(ctx, 'kick'); },
  async ban(ctx) { return manual(ctx, 'ban'); },
  async xtimeout(ctx) { return manual(ctx, 'xtimeout'); },

  async unpunish(ctx) {
    const u = ctx.user('username');
    const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
    if (!m) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Member Not Found`, 'Target member could not be found in this server.')] });
    if (ctx.member.id !== ctx.guild.ownerId && topPos(ctx.member) <= topPos(m)) {
      return no(ctx, 'Your highest role must outrank the target member.');
    }
    if (!isX(ctx.guild.id, m.id)) {
      return ctx.reply({ embeds: [embed(`${EMOJI_STATS} No Active Timeout`, `${m} does not currently have an active X-Timeout.`)] });
    }
    clearX(ctx.guild.id, m.id);
    await m.timeout(null, `unpunished by ${ctx.member.user.tag}`).catch(() => {});
    log(ctx.guild, 'unpunish', `${ctx.member} removed the timeout on ${m}`);
    return ctx.reply({
      embeds: [
        embed(
          `${EMOJI_ON} Timeout Removed`,
          `${m} has been unmuted and their X-Timeout restriction was cleared.`
        )
      ]
    });
  },

  async userinfo(ctx) {
    const u = ctx.user('user') || ctx.member.user;
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const v = tracker.violations(ctx.guild.id, u.id);
    const active = isX(ctx.guild.id, u.id);
    const statusText = active ? 'Timed out (X-Timeout active)' : (v.length > 0 ? `${v.length} recorded violation(s)` : 'Clean / No violations');

    const desc = [
      `**User:** ${u} (\`${u.id}\`)`,
      `**Account type:** ${u.bot ? 'Bot' : 'Member'}`,
      `**Highest role:** ${m ? m.roles.highest : 'None'}`,
      `**Created:** <t:${Math.floor(u.createdTimestamp / 1000)}:R>`,
      `**Joined server:** ${m ? `<t:${Math.floor(m.joinedTimestamp / 1000)}:R>` : 'Not in server'}`,
      '',
      `**Status:** ${statusText}`,
      `**Total violations:** ${v.length}`
    ].join('\n');

    return ctx.reply({
      embeds: [
        embed(`${EMOJI_STATS} User Info: ${u.username}`, desc)
          .setThumbnail(u.displayAvatarURL({ size: 256 }))
      ]
    });
  },

  async monitor(ctx) {
    if (!canConfigure(ctx.member)) return no(ctx);
    const u = ctx.user('user');
    if (!u) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Member Required`, 'Please select a member to inspect.')] });
    const m = await ctx.guild.members.fetch(u.id).catch(() => null);
    const s = tracker.get(ctx.guild.id, u.id);
    const v = tracker.violations(ctx.guild.id, u.id);
    const recent = v.slice(-5).reverse().map((x) => `• \`${x.rule}\` <t:${Math.floor(x.at / 1000)}:R>`).join('\n') || '*No violations recorded*';
    const rate = tracker.perMinute(ctx.guild.id, u.id);

    const desc = [
      `**Member:** ${u} (\`${u.id}\`)`,
      `**Message speed:** ${rate} msgs/min`,
      `**Messages recorded:** ${s.total}`,
      `**Channels used:** ${s.channels.size}`,
      `**Voice channel:** ${m?.voice?.channel ? m.voice.channel : 'Not connected'}`,
      `**Time in voice:** ${fmtMs(tracker.vcTotal(ctx.guild.id, u.id))}`,
      `**Threads created:** ${s.threads}`,
      `**X-Timeout status:** ${isX(ctx.guild.id, u.id) ? 'ACTIVE' : 'None'}`,
      '',
      `**Recent Violations (${v.length})**`,
      recent
    ].join('\n');

    return ctx.reply({
      embeds: [
        embed(`${EMOJI_STATS} Activity Monitor: ${u.username}`, desc)
          .setThumbnail(u.displayAvatarURL({ size: 256 }))
      ]
    });
  },

  async badges(ctx) {
    const guildCount = ctx.guild.client.guilds.cache.size;
    const slashCount = defs.filter((item) => item.type === 1).length;
    const desc = [
      `### ${EMOJI_SHIELD} Bot Information`,
      `• **Servers:** Active in ${guildCount} server(s)`,
      `• **Commands:** ${slashCount} slash commands available`,
      '',
      `### ${EMOJI_GEAR} Badges & Verification`,
      '• **Slash Commands (/):** Active and registered globally.',
      '• **Bot Verification:** Submitted in the Discord Developer Portal once eligible.',
      '• **Active Developer Badge:** Discontinued by Discord.',
      '• **Bot Directories:** Listed directories grant their own badges independently.',
      '',
      '*For questions, check the Developer Portal or join the support server.*'
    ].join('\n');
    return ctx.reply({ embeds: [embed(`${EMOJI_SHIELD} Rize Bot Status`, desc).setThumbnail(GIF)] });
  },
};

// /commands alias for /help
run.commands = run.help;

async function manual(ctx, type) {
  const u = ctx.user('user');
  const m = u && (await ctx.guild.members.fetch(u.id).catch(() => null));
  if (!m) return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Member Not Found`, 'Target member could not be found in this server.')] });
  const perm = {
    kick: PermissionFlagsBits.KickMembers,
    ban: PermissionFlagsBits.BanMembers,
    xtimeout: PermissionFlagsBits.ModerateMembers
  }[type];
  if (!ctx.member.permissions.has(perm) && !canConfigure(ctx.member)) return no(ctx);
  if (!canPunish(ctx.member, m)) return no(ctx, 'Your role and Rize must both be placed higher than the target member.');
  const reason = ctx.str('reason') || 'No reason provided';
  try {
    if (type === 'kick') await m.kick(reason);
    else if (type === 'ban') await m.ban({ reason });
    else await xtimeout(m, reason);
  } catch (e) {
    return ctx.reply({ embeds: [embed(`${EMOJI_OFF} Action Failed`, e.message)] });
  }
  log(ctx.guild, `manual ${type}`, `${ctx.member} performed ${type} on ${m}\n**Reason:** ${reason}`);
  const actionName = type === 'xtimeout' ? 'X-Timeout' : type.toUpperCase();
  return ctx.reply({
    embeds: [
      embed(
        `${EMOJI_RAID} ${actionName} Applied`,
        `**User:** ${m.user.tag} (${m})\n**Moderator:** ${ctx.member}\n**Reason:** ${reason}${type === 'xtimeout' ? '\n\n*Applied 5-hour timeout, disconnected voice, and deleted active threads.*' : ''}`
      )
    ]
  });
}

async function runUserContext(i) {
  const target = i.targetUser;
  const member = await i.guild.members.fetch(target.id).catch(() => null);
  const violations = tracker.violations(i.guild.id, target.id);
  const active = isX(i.guild.id, target.id);
  const desc = [
    `**User:** ${target} (\`${target.id}\`)`,
    `**Role rank:** ${member ? member.roles.highest : 'Not in server'}`,
    `**Violations:** ${violations.length}`,
    `**X-Timeout:** ${active ? 'Active' : 'None'}`
  ].join('\n');
  return i.reply({
    embeds: [
      embed(`${EMOJI_STATS} Security Check: ${target.username}`, desc)
        .setThumbnail(target.displayAvatarURL({ size: 128 }))
    ],
    ephemeral: true
  });
}

async function runMessageContext(i) {
  const msg = i.targetMessage;
  const content = msg.content || '';
  const links = /https?:\/\/\S+/i.test(content);
  const mentions = msg.mentions.users.size;
  const zalgo = /[\u0300-\u036f\u0489]{3,}/i.test(content);
  const desc = [
    `**Author:** ${msg.author}`,
    `**Channel:** <#${msg.channelId}>`,
    `**Links detected:** ${links ? `${EMOJI_OFF} Yes` : `${EMOJI_ON} None`}`,
    `**Mentions:** ${mentions}`,
    `**Zalgo characters:** ${zalgo ? `${EMOJI_OFF} Detected` : `${EMOJI_ON} None`}`,
    `**Length:** ${content.length} characters`
  ].join('\n');
  return i.reply({
    embeds: [embed(`${EMOJI_SHIELD} Message Scan`, desc)],
    ephemeral: true
  });
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
