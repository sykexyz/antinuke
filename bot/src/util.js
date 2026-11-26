const { PermissionFlagsBits } = require('discord.js');
const store = require('./store');

// Custom emojis provided by user
const EMOJI = '<:rize:1574973435950538943>';
const EMOJI_SHIELD = '<:rize_shield:1574987772417282228>';
const EMOJI_ON = '<:rize_on:1575455399598104699>';
const EMOJI_OFF = '<:rize_off:1575455894601343057>';
const EMOJI_RAID = '<:rize_raid:1575456277625045094>';
const EMOJI_BELL = '<:rize_bell:1575456544118800384>';
const EMOJI_STATS = '<:rize_stats:1575456922847674520>';
const EMOJI_GEAR = '<:rize_gear:1575457093937537144>';

const STICKER_ON = '1574987768696799352';
const STICKER_OFF = '1574987772417282228';
const APP_ID = '1574970846311620608';
const RED = 0xb3001b;
const GIF = 'https://file.garden/aahuG_hIDGRlXD24/b189922eab130325a3995bfa1a3021eb.gif';

const flag = (on) => (on ? EMOJI_ON : EMOJI_OFF);

const topPos = (member) => member?.roles?.highest?.position ?? 0;

// authority model: owner > whitelist role > anyone above the bot
function canConfigure(member) {
  if (!member) return false;
  const g = member.guild;
  if (g.ownerId === member.id) return true;
  const cfg = store.guild(g.id);
  if (cfg.wl.role && member.roles.cache.has(cfg.wl.role)) return true;
  return topPos(member) > topPos(g.members.me);
}

// for punishing someone: you need to outrank them, and the bot does too
function canPunish(mod, target) {
  if (!target) return false;
  if (target.id === target.guild.ownerId) return false;
  if (mod.id === mod.guild.ownerId) return topPos(target.guild.members.me) > topPos(target);
  return topPos(mod) > topPos(target) && topPos(mod.guild.members.me) > topPos(target);
}

function isBypassed(member) {
  if (!member) return false;
  const cfg = store.guild(member.guild.id);
  if (member.id === member.guild.ownerId) return true;
  if (member.id === member.client.user.id) return true;
  if (member.user.bot && cfg.wl.bots.includes(member.id)) return true;
  if (cfg.wl.users.includes(member.id)) return true;
  if (cfg.wl.role && member.roles.cache.has(cfg.wl.role)) return true;
  return false;
}

const pad = (n, w = 4) => String(n).padStart(w, '0');

module.exports = {
  EMOJI,
  EMOJI_SHIELD,
  EMOJI_ON,
  EMOJI_OFF,
  EMOJI_RAID,
  EMOJI_BELL,
  EMOJI_STATS,
  EMOJI_GEAR,
  STICKER_ON,
  STICKER_OFF,
  APP_ID,
  RED,
  GIF,
  flag,
  topPos,
  canConfigure,
  canPunish,
  isBypassed,
  pad,
  PermissionFlagsBits,
};
