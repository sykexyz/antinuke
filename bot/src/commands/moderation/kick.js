import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";
import { canModerate } from "../../utils/permissions.js";

export default {
  name: "kick",
  description: "Kick a member from the server",
  usage: "!kick @user [reason]",
  category: "moderation",
  ownerOnly: true,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need KickMembers permission.")] });

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply({ embeds: [errorEmbed("No Target", "Please mention a user to kick.")] });
    if (!canModerate(message.member, target))
      return message.reply({ embeds: [errorEmbed("Cannot Moderate", "I cannot kick this user.")] });

    const reason = args.slice(1).join(" ") || "No reason provided";
    await target.kick(`[${message.author.tag}] ${reason}`);
    const caseId = await createCase(message.guild.id, { userId: target.id, moderatorId: message.author.id, action: "KICK", reason });
    await message.reply({ embeds: [successEmbed("Kicked", `**${target.user.tag}** has been kicked.\n**Reason:** ${reason}\n**Case #${caseId}**`)] });
  },
};
