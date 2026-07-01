import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed, errorEmbed } from "../../utils/embed.js";

const responses = [
  "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.",
  "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
  "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
  "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
  "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
];

export default {
  name: "8ball",
  description: "Ask the magic 8ball a question",
  category: "fun",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8ball a question")
    .addStringOption(opt => opt.setName("question").setDescription("Your question").setRequired(true)),
  async execute(interaction, client) {
    const question = interaction.options.getString("question");
    const response = responses[Math.floor(Math.random() * responses.length)];
    await interaction.reply({ embeds: [primaryEmbed("Magic 8Ball 🎱", `**◦ Question** — ${question}\n\n**◦ Answer** — ${response}`)] });
  },
};
