import { EmbedBuilder } from "discord.js";

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
  description: "Roast a user with a random savage line",
  usage: "!roast @user",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    const target = message.mentions.users.first() || message.author;
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    const embed = new EmbedBuilder()
      .setColor(0xff3333)
      .setTitle(`Roasting ${target.username} 🔥`)
      .setDescription(roast)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
