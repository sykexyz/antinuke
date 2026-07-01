import { primaryEmbed } from "../../utils/embed.js";

export default {
  name: "rate",
  description: "Rates anything out of 10 with a funny comment",
  category: "extra",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!rate <anything>`");
    const thing = args.join(" ");
    const seed = thing.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const score = (seed % 101) / 10;
    const comments = ["Absolutely terrible.","Could be worse.","Meh, it exists.","Not bad actually.","Solid choice.","Pretty good!","Excellent taste.","Top tier fr.","Almost perfect.","Peak. Undeniable.","LEGENDARY 🔥"];
    const comment = comments[Math.min(Math.floor(score), 10)];
    const bar = "▓".repeat(Math.floor(score)) + "░".repeat(10 - Math.floor(score));
    message.reply({ embeds: [primaryEmbed(`Rating — ${thing}`, `[${bar}] **${score.toFixed(1)}/10**\n*${comment}*`)] });
  },
};
