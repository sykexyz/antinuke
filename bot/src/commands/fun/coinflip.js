import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed } from "../../utils/embed.js";

export default {
  name: "coinflip",
  description: "Flip a coin",
  category: "fun",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin"),
  async execute(interaction, client) {
    const result = Math.random() < 0.5 ? "🪙 Heads" : "🪙 Tails";
    await interaction.reply({ embeds: [primaryEmbed("Coin Flip", `The coin landed on **${result}**!`)] });
  },
};
