import { EmbedBuilder } from "discord.js";

export default {
  name: "meme",
  description: "Get a random meme",
  usage: "!meme",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://www.reddit.com/r/memes/random.json", {
        headers: { "User-Agent": "SentrixBot/1.0" }
      });
      const post = res.data[0].data.children[0].data;
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle(post.title.slice(0, 256))
        .setImage(post.url)
        .setFooter({ text: `👍 ${post.ups} | r/memes` })
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch {
      await message.reply({ embeds: [{ color: 0xff3333, description: "Could not fetch a meme right now." }] });
    }
  },
};
