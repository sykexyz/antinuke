import { EmbedBuilder } from "discord.js";

export default {
  name: "dice",
  description: "Roll a dice",
  usage: "!dice [sides]",
  category: "fun",
  ownerOnly: false,
  aliases: ["roll"],
  cooldown: 3,
  async execute(message, args, client, config) {
    const sides = parseInt(args[0]) || 6;
    if (sides < 2 || sides > 1000)
      return message.reply({ embeds: [{ color: 0xff3333, description: "Dice must have 2–1000 sides." }] });
    const result = Math.floor(Math.random() * sides) + 1;
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`Dice Roll (d${sides})`)
      .setDescription(`You rolled a **${result}**!`)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
