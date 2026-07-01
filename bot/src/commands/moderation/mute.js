import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";

export default {
  name: "mute",
  description: "Timeout (mute) a member",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout (mute) a member")
    .addUserOption(opt => opt.setName("user").setDescription("User to mute").setRequired(true))
    .addIntegerOption(opt => opt.setName("duration").setDescription("Duration in minutes").setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the mute").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Moderate Members** permission.")], ephemeral: true });

    const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id).catch(() => null);
    if (!target) return interaction.reply({ embeds: [errorEmbed("Not Found", "That user is not in this server.")], ephemeral: true });

    const duration = interaction.options.getInteger("duration");
    const reason = interaction.options.getString("reason") || "No reason provided";
    await target.timeout(duration * 60 * 1000, reason);
    const caseId = await createCase(interaction.guild.id, { userId: target.id, moderatorId: interaction.user.id, action: "MUTE", reason, duration });
    await interaction.reply({ embeds: [successEmbed("Muted", `**${target.user.tag}** muted for **${duration} minutes**.\n**◦ Reason:** ${reason}\n**◦ Case:** #${caseId}`)] });
  },
};
