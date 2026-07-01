import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "rng",
  description: "Random number generator with a range",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const min = parseInt(args[0] ?? 1), max = parseInt(args[1] ?? 100);
    if (isNaN(min) || isNaN(max)) return message.reply("Usage: `!rng <min> <max>`");
    if (min >= max) return message.reply({ embeds: [errorEmbed("Invalid", "Min must be less than max.")] });
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    message.reply({ embeds: [infoEmbed("Random Number", `🎲 **${result}**\n*Range: ${min} – ${max}*`)] });
  },
};
