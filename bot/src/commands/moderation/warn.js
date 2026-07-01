import { successEmbed, errorEmbed, warnEmbed } from "../../utils/embed.js";
import { getMember, updateMember, createCase } from "../../lib/db.js";
import { PermissionFlagsBits } from "discord.js";

export default {
  name: "warn",
  description: "Warn a member",
  usage: "!warn @user [reason]",
  category: "moderation",
  ownerOnly: true,
  aliases: [],
  cooldown: 3,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ModerateMembers permission.")] });

    const target = message.mentions.members.first();
    if (!target) return message.reply({ embeds: [errorEmbed("No Target", "Mention a user to warn.")] });

    const reason = args.slice(1).join(" ") || "No reason provided";
    const member = await getMember(target.id, message.guild.id);
    const newWarns = (member.warns || 0) + 1;
    await updateMember(target.id, message.guild.id, { warns: newWarns });
    const caseId = await createCase(message.guild.id, { userId: target.id, moderatorId: message.author.id, action: "WARN", reason });

    await message.reply({ embeds: [warnEmbed("Warning Issued", `**${target.user.tag}** warned. Total warns: **${newWarns}**\n**Reason:** ${reason}\n**Case #${caseId}**`)] });
    await target.user.send({ embeds: [warnEmbed("You were warned", `**Server:** ${message.guild.name}\n**Reason:** ${reason}\n**Total Warns:** ${newWarns}`)] }).catch(() => {});

    // Auto-punish thresholds
    if (newWarns >= 5) {
      await target.ban({ reason: `Auto-ban: 5 warnings` }).catch(() => {});
      await message.channel.send({ embeds: [errorEmbed("Auto-Ban", `${target.user.tag} reached 5 warnings and was auto-banned.`)] });
    } else if (newWarns >= 3) {
      await target.timeout(30 * 60 * 1000, "Auto-mute: 3 warnings").catch(() => {});
      await message.channel.send({ embeds: [warnEmbed("Auto-Mute", `${target.user.tag} reached 3 warnings and was muted for 30 minutes.`)] });
    }
  },
};
