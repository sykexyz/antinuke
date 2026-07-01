import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "charcount",
  description: "Counts characters, words, sentences and more in text",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!charcount <text>`");
    const text = args.join(" ");
    const chars = text.length;
    const noSpaces = text.replace(/\s/g,"").length;
    const words = (text.match(/\b\w+\b/g)||[]).length;
    const sentences = (text.match(/[.!?]+/g)||[]).length;
    const lines = text.split("\n").length;
    const unique = new Set(text.toLowerCase().match(/\b\w+\b/g)||[]).size;
    message.reply({ embeds: [infoEmbed("Character Count",
      `**Characters:** ${chars}\n**Without spaces:** ${noSpaces}\n**Words:** ${words}\n**Unique words:** ${unique}\n**Sentences:** ${sentences}\n**Lines:** ${lines}`
    )] });
  },
};
