import { SlashCommandBuilder } from "discord.js";
import { pinkEmbed } from "../../utils/embed.js";

export default {
  name: "ship",
  description: "Ship two users together and check compatibility",
  category: "fun",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Ship two users together and check compatibility")
    .addUserOption(opt => opt.setName("user1").setDescription("First user").setRequired(true))
    .addUserOption(opt => opt.setName("user2").setDescription("Second user").setRequired(true)),
  async execute(interaction, client) {
    const u1 = interaction.options.getUser("user1");
    const u2 = interaction.options.getUser("user2");
    const seed = (u1.id + u2.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct = seed % 101;
    const filled = Math.floor(pct / 10);
    const bar = "█".repeat(filled) + "░".repeat(10 - filled);
    const verdict = pct >= 80 ? "A perfect match! 💍" : pct >= 50 ? "Pretty good! 💕" : pct >= 30 ? "Could work... 🤔" : "Not looking great... 💔";
    await interaction.reply({ embeds: [pinkEmbed("Compatibility ♥", `**${u1.username}** ❤️ **${u2.username}**\n\n\`[${bar}]\` **${pct}%**\n\n${verdict}`)] });
  },
};
