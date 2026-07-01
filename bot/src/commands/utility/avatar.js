import { EmbedBuilder } from "discord.js";

export default {
  name: "avatar",
  description: "View a user's avatar",
  usage: "!avatar [@user]",
  category: "utility",
  ownerOnly: false,
  aliases: ["av", "pfp"],
  cooldown: 3,
  async execute(message, args, client, config) {
    const target = message.mentions.users.first() || message.author;
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`${target.tag}'s Avatar`)
      .setImage(target.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setURL(target.displayAvatarURL({ dynamic: true, size: 4096 }))
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
