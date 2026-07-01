import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed } from "../../utils/embed.js";

export default {
  name: "dice",
  description: "Roll a dice",
  category: "fun",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice")
    .addIntegerOption(opt => opt.setName("sides").setDescription("Number of sides (default 6)").setRequired(false).setMinValue(2).setMaxValue(1000)),
  async execute(interaction, client) {
    const sides = interaction.options.getInteger("sides") || 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply({ embeds: [primaryEmbed(`🎲 Dice Roll (d${sides})`, `You rolled a **${result}**!`)] });
  },
};
