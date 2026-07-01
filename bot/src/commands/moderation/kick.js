import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";
import { canModerate } from "../../utils/permissions.js";

export default {
  name: "kick",
  description: "Kick a member from the server",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server")
    .addUserOption(opt => opt.setName("user").setDescription("User to kick").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the kick").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Kick Members** permission.")], ephemeral: true });

    const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id).catch(() => null);
    if (!target) return interaction.reply({ embeds: [errorEmbed("Not Found", "That user is not in this server.")], ephemeral: true });
    if (!canModerate(interaction.member, target))
      return interaction.reply({ embeds: [errorEmbed("Cannot Moderate", "I cannot kick this user due to role hierarchy.")], ephemeral: true });

    const reason = interaction.options.getString("reason") || "No reason provided";
    await target.kick(`[${interaction.user.tag}] ${reason}`);
    const caseId = await createCase(interaction.guild.id, { userId: target.id, moderatorId: interaction.user.id, action: "KICK", reason });
    await interaction.reply({ embeds: [successEmbed("Kicked", `**${target.user.tag}** has been kicked.\n**◦ Reason:** ${reason}\n**◦ Case:** #${caseId}`)] });
  },
};
