import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "dog",
  description: "Get a random dog image",
  category: "fun",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("dog")
    .setDescription("Get a random dog image"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://dog.ceo/api/breeds/image/random");
      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setAuthor({ name: "◆  Random Dog 🐶" })
        .setImage(res.data.message)
        .setFooter({ text: "SENTRIX" })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({ embeds: [errorEmbed("Error", "Could not fetch a dog image.")] });
    }
  },
};
