import { SlashCommandBuilder } from "discord.js";
import { errorEmbed } from "../../utils/embed.js";

const roasts = [
  "You're the reason the gene pool needs a lifeguard.",
  "I'd roast you harder but my mom said I'm not allowed to burn trash.",
  "You're like a cloud — when you disappear, it's a beautiful day.",
  "I've seen people like you before, but I had to pay admission.",
  "You have the right to remain silent because whatever you say will probably be stupid anyway.",
  "I could eat a bowl of alphabet soup and spit out a smarter statement than you.",
  "You're not the dumbest person in the world, but you better hope they don't die.",
  "Somewhere out there is a tree tirelessly producing oxygen for you. You owe that tree an apology.",
  "If laughter is the best medicine, your face must be curing diseases.",
  "You're like a software update — whenever I see you, I think 'not now'.",
];

export default {
  name: "roast",
  description: "Roast a user with a savage line",
  category: "fun",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("roast")
    .setDescription("Roast a user with a savage line")
    .addUserOption(opt => opt.setName("user").setDescription("User to roast").setRequired(true)),
  async execute(interaction, client) {
    const target = interaction.options.getUser("user");
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    await interaction.reply({ embeds: [errorEmbed(`🔥 Roasting ${target.username}`, roast)] });
  },
};
