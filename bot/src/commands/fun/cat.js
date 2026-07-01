import { EmbedBuilder } from "discord.js";

export default {
  name: "cat",
  description: "Get a random cat image",
  usage: "!cat",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://api.thecatapi.com/v1/images/search");
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Random Cat 🐱")
        .setImage(res.data[0].url)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch {
      await message.reply({ embeds: [{ color: 0xff3333, description: "Could not fetch a cat image." }] });
    }
  },
};
