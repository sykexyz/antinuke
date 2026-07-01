import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "purge",
  description: "Delete messages from the channel",
  usage: "!purge <amount> [@user]",
  category: "moderation",
  ownerOnly: true,
  aliases: ["clear", "nuke"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ManageMessages permission.")] });

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100)
      return message.reply({ embeds: [errorEmbed("Invalid Amount", "Provide a number between 1 and 100.")] });

    const target = message.mentions.members.first();
    await message.delete().catch(() => {});

    let messages = await message.channel.messages.fetch({ limit: 100 });
    if (target) messages = messages.filter(m => m.author.id === target.id);
    messages = messages.first(amount);

    const deleted = await message.channel.bulkDelete(messages, true).catch(() => null);
    const count = deleted?.size || 0;
    const reply = await message.channel.send({ embeds: [successEmbed("Purged", `Deleted **${count}** messages${target ? ` from ${target.user.tag}` : ""}.`)] });
    setTimeout(() => reply.delete().catch(() => {}), 5000);
  },
};
