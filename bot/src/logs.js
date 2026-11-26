const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const store = require('./store');
const { RED, GIF, EMOJI_SHIELD, EMOJI_BELL } = require('./util');

const NAME = 'rize-logs';

async function ensureLogChannel(guild, { welcome = true } = {}) {
  const cfg = store.guild(guild.id);
  let ch = cfg.logChannel && guild.channels.cache.get(cfg.logChannel);
  if (!ch) ch = guild.channels.cache.find((c) => c.name === NAME && c.type === ChannelType.GuildText);
  if (ch) {
    cfg.logChannel = ch.id;
    store.save();
    return ch;
  }

  const me = guild.members.me;
  if (!me?.permissions.has(PermissionFlagsBits.ManageChannels)) return null;

  const overwrites = [
    { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
    { id: me.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks] },
  ];
  if (cfg.wl.role) overwrites.push({ id: cfg.wl.role, allow: [PermissionFlagsBits.ViewChannel] });

  try {
    ch = await guild.channels.create({
      name: NAME,
      type: ChannelType.GuildText,
      permissionOverwrites: overwrites,
      reason: 'rize log channel',
    });
  } catch (e) {
    console.warn(`[logs] couldn't make channel in ${guild.name}:`, e.message);
    return null;
  }
  cfg.logChannel = ch.id;
  store.save();
  if (welcome) await sendWelcome(ch).catch(() => {});
  return ch;
}

// when the whitelist role changes, let it see the logs
async function syncLogAccess(guild) {
  const cfg = store.guild(guild.id);
  const ch = cfg.logChannel && guild.channels.cache.get(cfg.logChannel);
  if (ch && cfg.wl.role) await ch.permissionOverwrites.edit(cfg.wl.role, { ViewChannel: true }).catch(() => {});
}

function sendWelcome(ch) {
  const e = new EmbedBuilder()
    .setColor(RED)
    .setTitle(`${EMOJI_SHIELD} Rize Bot is now active`)
    .setThumbnail(ch.client.user.displayAvatarURL({ size: 256 }))
    .setDescription(
      [
        "I'm Rize. I protect this server against spam, raids, nukes, and unwanted bots. Messages, member joins, voice channels, threads, and role/channel changes are monitored in real time.",
        '',
        '**Recommended Setup**',
        '• Move my role above any roles I need to moderate in Server Settings.',
        '• Use `/antinuke stats` to view and customize security modules.',
        '• Use `/whitelist role` to grant server managers access to bot settings.',
        '• Use `/help` to view all available commands.',
      ].join('\n')
    )
    .setImage(GIF)
    .setFooter({ text: 'RizeSec • Server Protection', iconURL: GIF });
  return ch.send({ embeds: [e] });
}

async function log(guild, title, desc, color = RED) {
  const ch = await ensureLogChannel(guild, { welcome: true });
  if (!ch) return;
  const e = new EmbedBuilder()
    .setColor(color)
    .setTitle(`${EMOJI_BELL} ${title}`)
    .setDescription(desc)
    .setTimestamp()
    .setFooter({ text: 'RizeSec • Server Protection', iconURL: GIF });
  ch.send({ embeds: [e] }).catch(() => {});
}

module.exports = { ensureLogChannel, syncLogAccess, sendWelcome, log };
