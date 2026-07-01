import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { createCase } from "../../lib/db.js";
import { canModerate } from "../../utils/permissions.js";

export default {
  name: "ban",
  description: "Ban a member from the server",
  usage: "!ban @user [reason]",
  category: "moderation",
  ownerOnly: true,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need BanMembers permission.")] });

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) return message.reply({ embeds: [errorEmbed("No Target", "Please mention a user to ban.")] });
    if (!canModerate(message.member, target))
      return message.reply({ embeds: [errorEmbed("Cannot Moderate", "I cannot ban this user (hierarchy).")] });

    const reason = args.slice(1).join(" ") || "No reason provided";
    await target.ban({ reason: `[${message.author.tag}] ${reason}` });
    const caseId = await createCase(message.guild.id, { userId: target.id, moderatorId: message.author.id, action: "BAN", reason });

    await message.reply({ embeds: [successEmbed("Banned", `**${target.user.tag}** has been banned.\n**Reason:** ${reason}\n**Case #${caseId}**`)] });
    await target.user.send({ embeds: [errorEmbed("Banned", `You were banned from **${message.guild.name}**.\n**Reason:** ${reason}`)] }).catch(() => {});
  },
};
