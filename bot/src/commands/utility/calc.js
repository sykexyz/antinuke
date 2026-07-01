import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "calc",
  description: "Calculate a math expression",
  category: "utility",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("calc")
    .setDescription("Calculate a math expression")
    .addStringOption(opt => opt.setName("expression").setDescription("Math expression to evaluate").setRequired(true)),
  async execute(interaction, client) {
    const expr = interaction.options.getString("expression").replace(/[^0-9+\-*/().% ]/g, "");
    if (!expr) return interaction.reply({ embeds: [errorEmbed("Invalid", "Provide a valid math expression.")], ephemeral: true });
    try {
      const result = Function(`"use strict"; return (${expr})`)();
      await interaction.reply({ embeds: [primaryEmbed("Calculator", `**◦ Expression** — \`${expr}\`\n**◦ Result** — \`${result}\``)] });
    } catch {
      await interaction.reply({ embeds: [errorEmbed("Error", "Invalid expression.")], ephemeral: true });
    }
  },
};
