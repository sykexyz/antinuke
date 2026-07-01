import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { query } from "../../lib/db.js";
import { COLORS, errorEmbed } from "../../utils/embed.js";

const medals = ["🥇", "🥈", "🥉"];

export default {
  name: "leaderboard",
  description: "View the XP leaderboard for this server",
  category: "leveling",
  ownerOnly: false,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the XP leaderboard for this server"),
  async execute(interaction, client) {
    const res = await query(
      "SELECT user_id, xp, level FROM members WHERE guild_id = $1 ORDER BY xp DESC LIMIT 10",
      [interaction.guild.id]
    );
    if (!res.rows.length) return interaction.reply({ embeds: [errorEmbed("Empty", "No members found on the leaderboard.")], ephemeral: true });
    const rows = res.rows.map((r, i) => {
      const medal = medals[i] || `**#${i + 1}**`;
      return `${medal} <@${r.user_id}> — Lvl \`${r.level}\` — \`${r.xp} XP\``;
    }).join("\n");
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${interaction.guild.name}  —  XP Leaderboard`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
      .setDescription(rows)
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
