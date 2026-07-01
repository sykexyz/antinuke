import { EmbedBuilder } from "discord.js";

const COLORS = {
  success: 0x00e676,
  error:   0xff1744,
  info:    0x40c4ff,
  warn:    0xffab00,
  nuke:    0xff1744,
  primary: 0x7c4dff,
  pink:    0xff69b4,
  neutral: 0x2b2d31,
};

const SYMBOLS = {
  success: "✦",
  error:   "✕",
  info:    "◈",
  warn:    "◬",
  nuke:    "⚡",
  primary: "◆",
};

function base(color, symbol, title, description) {
  return new EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: `${symbol}  ${title}` })
    .setDescription(description)
    .setFooter({ text: "SENTRIX" })
    .setTimestamp();
}

export function successEmbed(title, description) {
  return base(COLORS.success, SYMBOLS.success, title, description);
}

export function errorEmbed(title, description) {
  return base(COLORS.error, SYMBOLS.error, title, description);
}

export function infoEmbed(title, description) {
  return base(COLORS.info, SYMBOLS.info, title, description);
}

export function warnEmbed(title, description) {
  return base(COLORS.warn, SYMBOLS.warn, title, description);
}

export function nukeAlertEmbed(action, perpetrator, guildName) {
  return new EmbedBuilder()
    .setColor(COLORS.nuke)
    .setAuthor({ name: "⚡  ANTI-NUKE TRIGGERED" })
    .setDescription(`**Action Blocked:** ${action}\n**Perpetrator:** ${perpetrator}\n**Server:** ${guildName}`)
    .setFooter({ text: "SENTRIX  •  Security System" })
    .setTimestamp();
}

export function primaryEmbed(title, description) {
  return base(COLORS.primary, SYMBOLS.primary, title, description);
}

export function pinkEmbed(title, description) {
  return base(COLORS.pink, "♥", title, description);
}

export { COLORS };
