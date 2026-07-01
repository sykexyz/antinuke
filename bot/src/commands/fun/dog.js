import { EmbedBuilder } from "discord.js";

export default {
  name: "dog",
  description: "Get a random dog image",
  usage: "!dog",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Random Dog 🐶")
        .setImage(res.data.message)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch {
      await message.reply({ embeds: [{ color: 0xff3333, description: "Could not fetch a dog image." }] });
    }
  },
};
