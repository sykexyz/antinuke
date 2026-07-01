import { EmbedBuilder } from "discord.js";

export default {
  name: "coinflip",
  description: "Flip a coin",
  usage: "!coinflip",
  category: "fun",
  ownerOnly: false,
  aliases: ["cf", "flip"],
  cooldown: 3,
  async execute(message, args, client, config) {
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle("Coin Flip")
      .setDescription(`The coin landed on **${result}**!`)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
