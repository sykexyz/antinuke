import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "meme",
  description: "Get a random meme from Reddit",
  category: "fun",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random meme from Reddit"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://www.reddit.com/r/memes/random.json", {
        headers: { "User-Agent": "SentrixBot/1.0" }
      });
      const post = res.data[0].data.children[0].data;
      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setAuthor({ name: `◆  ${post.title.slice(0, 256)}` })
        .setImage(post.url)
        .setFooter({ text: `👍 ${post.ups}  •  r/memes  •  SENTRIX` })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed("Error", "Could not fetch a meme right now.")] });
    }
  },
};
