import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";
import { xpForLevel } from "../../utils/xp.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "rank",
  description: "View your XP rank card",
  category: "leveling",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your XP rank card")
    .addUserOption(opt => opt.setName("user").setDescription("Target user").setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const target = await interaction.guild.members.fetch(user.id).catch(() => interaction.member);
    const member = await getMember(target.id, interaction.guild.id);
    const level = member.level || 0;
    const xp = member.xp || 0;
    const needed = xpForLevel(level);
    const pct = Math.min(100, Math.floor((xp / needed) * 100));
    const filled = Math.floor(pct / 10);
    const bar = "▓".repeat(filled) + "░".repeat(10 - filled);
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${user.username}'s Rank`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setDescription(`\`[${bar}]\` **${pct}%**`)
      .addFields(
        { name: "Level", value: `\`${level}\``, inline: true },
        { name: "XP", value: `\`${xp} / ${needed}\``, inline: true },
        { name: "Coins", value: `\`${member.coins || 0}\` 🪙`, inline: true },
      )
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
