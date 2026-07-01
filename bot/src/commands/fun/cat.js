import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "cat",
  description: "Get a random cat image",
  category: "fun",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("cat")
    .setDescription("Get a random cat image"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://api.thecatapi.com/v1/images/search");
      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setAuthor({ name: "◆  Random Cat 🐱" })
        .setImage(res.data[0].url)
        .setFooter({ text: "SENTRIX" })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed("Error", "Could not fetch a cat image.")] });
    }
  },
};
