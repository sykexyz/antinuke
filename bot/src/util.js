const { PermissionFlagsBits } = require('discord.js');
const store = require('./store');

const EMOJI = '<:rize:1574973435950538943>';
const STICKER_ON = '1574987768696799352';
const STICKER_OFF = '1574987772417282228';
const APP_ID = '1574970846311620608';
const RED = 0xb3001b;
const GIF = 'https://file.garden/aahuG_hIDGRlXD24/b189922eab130325a3995bfa1a3021eb.gif';

// stickers don't render inline in embeds, so we drop them in emoji-style
// (discord resolves these when the sticker id is also uploaded as an emoji, otherwise it's still a clear marker)
// Sticker IDs cannot be rendered inline in embeds; use reliable status glyphs here.
const flag = (on) => (on ? '🔴' : '⚪');

const topPos = (member) => member?.roles?.highest?.position ?? 0;

// the whole authority model. owner > whitelist role > anyone above the bot
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

module.exports = { EMOJI, STICKER_ON, STICKER_OFF, APP_ID, RED, GIF, flag, topPos, canConfigure, canPunish, isBypassed, pad, PermissionFlagsBits };
