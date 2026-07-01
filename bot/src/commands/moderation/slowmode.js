import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "slowmode",
  description: "Set slowmode for a channel",
  usage: "!slowmode <seconds>",
  category: "moderation",
  ownerOnly: true,
  aliases: ["slow"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ManageChannels permission.")] });

    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 0 || seconds > 21600)
      return message.reply({ embeds: [errorEmbed("Invalid", "Slowmode must be 0-21600 seconds.")] });

    await message.channel.setRateLimitPerUser(seconds);
    await message.reply({ embeds: [successEmbed("Slowmode", seconds === 0 ? "Slowmode disabled." : `Slowmode set to **${seconds}s**.`)] });
  },
};
