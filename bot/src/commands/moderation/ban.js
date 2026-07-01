import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";
import { canModerate } from "../../utils/permissions.js";

export default {
  name: "ban",
  description: "Ban a member from the server",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server")
    .addUserOption(opt => opt.setName("user").setDescription("User to ban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the ban").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Ban Members** permission.")], ephemeral: true });

    const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id).catch(() => null);
    if (!target) return interaction.reply({ embeds: [errorEmbed("Not Found", "That user is not in this server.")], ephemeral: true });
    if (!canModerate(interaction.member, target))
      return interaction.reply({ embeds: [errorEmbed("Cannot Moderate", "I cannot ban this user due to role hierarchy.")], ephemeral: true });

    const reason = interaction.options.getString("reason") || "No reason provided";
    await target.ban({ reason: `[${interaction.user.tag}] ${reason}` });
    const caseId = await createCase(interaction.guild.id, { userId: target.id, moderatorId: interaction.user.id, action: "BAN", reason });

    await interaction.reply({ embeds: [successEmbed("Banned", `**${target.user.tag}** has been banned.\n**◦ Reason:** ${reason}\n**◦ Case:** #${caseId}`)] });
    await target.user.send({ embeds: [errorEmbed("Banned", `You were banned from **${interaction.guild.name}**.\n**◦ Reason:** ${reason}`)] }).catch(() => {});
  },
};
