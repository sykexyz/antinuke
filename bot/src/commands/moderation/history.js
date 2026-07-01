import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { query } from "../../lib/db.js";
import { errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "history",
  description: "View mod history for a user",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("history")
    .setDescription("View mod history for a user")
    .addUserOption(opt => opt.setName("user").setDescription("Target user").setRequired(true)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Moderate Members** permission.")], ephemeral: true });

    const target = interaction.options.getUser("user");
    const res = await query("SELECT * FROM cases WHERE guild_id = $1 AND user_id = $2 ORDER BY created_at DESC LIMIT 10", [interaction.guild.id, target.id]);
    if (!res.rows.length) return interaction.reply({ embeds: [errorEmbed("No Cases", `No mod cases found for **${target.username}**.`)], ephemeral: true });

    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  Mod History — ${target.username}`, iconURL: target.displayAvatarURL({ dynamic: true }) })
      .setDescription(res.rows.map(c => `**#${c.case_id}** \`${c.action}\` — ${c.reason || "No reason"} — <t:${Math.floor(new Date(c.created_at).getTime() / 1000)}:R>`).join("\n"))
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
