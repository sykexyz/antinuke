const { ChannelType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const store = require('./store');
const { RED, GIF } = require('./util');

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
    ch = await guild.channels.create({ name: NAME, type: ChannelType.GuildText, permissionOverwrites: overwrites, reason: 'rize log channel' });
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
    .setTitle('hi thanks for trusting me, type /help')
    .setThumbnail(ch.client.user.displayAvatarURL({ size: 256 }))
    .setDescription(
      [
        "I'm Rize. I watch the people in this server, not just the server itself. Messages, joins, voice channels, threads, webhooks, role and channel changes. If someone starts acting up, I catch it and deal with it the way you told me to.",
        '',
        '**What I need**',
        'Manage Messages, Manage Channels, Moderate Members, Kick Members, Ban Members and View Audit Log. Put my role above anyone I should be able to punish. I can only touch people below me.',
        '',
        '**Why it\'s safe**',
        "Your config stays with the bot. Nothing gets sold, nothing gets sent to outside services. I don't read DMs and I don't keep message content, only counts.",
      ].join('\n')
    )
    .setImage(GIF)
    .setFooter({ text: 'Rize • protection done right' });
  return ch.send({ embeds: [e] });
}

async function log(guild, title, desc, color = RED) {
  const ch = await ensureLogChannel(guild, { welcome: true });
  if (!ch) return;
  const e = new EmbedBuilder().setColor(color).setTitle(title).setDescription(desc).setTimestamp().setFooter({ text: 'Rize • protection done right' });
  ch.send({ embeds: [e] }).catch(() => {});
}

module.exports = { ensureLogChannel, syncLogAccess, sendWelcome, log };
