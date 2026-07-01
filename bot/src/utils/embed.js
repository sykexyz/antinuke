import { EmbedBuilder } from "discord.js";

export const Colors = {
  green: 0x00ff41,
  red: 0xff3333,
  orange: 0xff8800,
  blue: 0x5865f2,
  yellow: 0xffcc00,
  gray: 0x36393f,
};

export function successEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(Colors.green)
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function errorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(Colors.red)
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function infoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(Colors.blue)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function warnEmbed(title, description) {
  return new EmbedBuilder()
    .setColor(Colors.orange)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

export function nukeAlertEmbed(action, perpetrator, guildName) {
  return new EmbedBuilder()
    .setColor(Colors.red)
    .setTitle("🛡️ ANTI-NUKE TRIGGERED")
    .setDescription(`**Action Blocked:** ${action}\n**Perpetrator:** ${perpetrator}\n**Server:** ${guildName}`)
    .setTimestamp()
    .setFooter({ text: "Sentrix Anti-Nuke System" });
}
