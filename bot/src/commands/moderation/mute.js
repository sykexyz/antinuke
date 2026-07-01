import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";

export default {
  name: "mute",
  description: "Timeout (mute) a member",
  usage: "!mute @user <duration_minutes> [reason]",
  category: "moderation",
  ownerOnly: true,
  aliases: ["timeout"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ModerateMembers permission.")] });

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply({ embeds: [errorEmbed("No Target", "Please mention a user to mute.")] });

    const duration = parseInt(args[1]);
    if (isNaN(duration) || duration <= 0)
      return message.reply({ embeds: [errorEmbed("Invalid Duration", "Provide duration in minutes (e.g. `!mute @user 10`)")] });

    const reason = args.slice(2).join(" ") || "No reason provided";
    await target.timeout(duration * 60 * 1000, reason);
    const caseId = await createCase(message.guild.id, { userId: target.id, moderatorId: message.author.id, action: "MUTE", reason, duration });
    await message.reply({ embeds: [successEmbed("Muted", `**${target.user.tag}** muted for **${duration} minutes**.\n**Reason:** ${reason}\n**Case #${caseId}**`)] });
  },
};
