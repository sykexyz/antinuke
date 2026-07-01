import { primaryEmbed, errorEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "profile",
  description: "Shows your profile card with bio, level, coins and badges",
  category: "social",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const member = await getMember(target.id, message.guild.id);
    const bio = member.bio || "*No bio set. Use `!bio <text>` to set one.*";
    const bars = Math.min(Math.floor(((member.xp || 0) % 100) / 10), 10);
    const xpBar = "▓".repeat(bars) + "░".repeat(10 - bars);
    const guildMember = await message.guild.members.fetch(target.id).catch(() => null);
    const roles = guildMember?.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.name).slice(0, 3).join(", ") || "None";
    const embed = primaryEmbed(`◆  ${target.username}'s Profile`,
      `${bio}\n\n` +
      `**Level:** ${member.level || 0}  •  **XP:** ${member.xp || 0}\n` +
      `[${xpBar}]\n\n` +
      `**Coins:** 🪙 ${member.coins || 0}\n` +
      `**Warns:** ⚠️ ${member.warns || 0}\n` +
      `**Rep:** ⭐ ${member.rep || 0}\n` +
      `**Top Roles:** ${roles}\n` +
      `**Joined:** <t:${Math.floor((guildMember?.joinedTimestamp || Date.now()) / 1000)}:R>`
    ).setThumbnail(target.displayAvatarURL({ size: 256 }));
    message.reply({ embeds: [embed] });
  },
};
