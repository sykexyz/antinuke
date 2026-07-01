import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed, warnEmbed } from "../../utils/embed.js";
import { getMember, updateMember, createCase } from "../../lib/db.js";

export default {
  name: "warn",
  description: "Warn a member",
  category: "moderation",
  ownerOnly: true,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member")
    .addUserOption(opt => opt.setName("user").setDescription("User to warn").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the warning").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Moderate Members** permission.")], ephemeral: true });

    const target = await interaction.guild.members.fetch(interaction.options.getUser("user").id).catch(() => null);
    if (!target) return interaction.reply({ embeds: [errorEmbed("Not Found", "That user is not in this server.")], ephemeral: true });

    const reason = interaction.options.getString("reason") || "No reason provided";
    const member = await getMember(target.id, interaction.guild.id);
    const newWarns = (member.warns || 0) + 1;
    await updateMember(target.id, interaction.guild.id, { warns: newWarns });
    const caseId = await createCase(interaction.guild.id, { userId: target.id, moderatorId: interaction.user.id, action: "WARN", reason });

    await interaction.reply({ embeds: [warnEmbed("Warning Issued", `**${target.user.tag}** warned. Total: **${newWarns}**\n**◦ Reason:** ${reason}\n**◦ Case:** #${caseId}`)] });
    await target.user.send({ embeds: [warnEmbed("You were warned", `**◦ Server:** ${interaction.guild.name}\n**◦ Reason:** ${reason}\n**◦ Total Warns:** ${newWarns}`)] }).catch(() => {});

    if (newWarns >= 5) {
      await target.ban({ reason: "Auto-ban: 5 warnings" }).catch(() => {});
      await interaction.followUp({ embeds: [errorEmbed("Auto-Ban", `${target.user.tag} reached 5 warnings and was auto-banned.`)] });
    } else if (newWarns >= 3) {
      await target.timeout(30 * 60 * 1000, "Auto-mute: 3 warnings").catch(() => {});
      await interaction.followUp({ embeds: [warnEmbed("Auto-Mute", `${target.user.tag} reached 3 warnings and was muted for 30 minutes.`)] });
    }
  },
};
