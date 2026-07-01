import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "wordfreq",
  description: "Shows word frequency count for a message",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!wordfreq <text>`");
    const words = args.join(" ").toLowerCase().match(/\b\w+\b/g) || [];
    if (!words.length) return message.reply({ embeds: [errorEmbed("Empty", "No words found.")] });
    const freq = {};
    for (const w of words) freq[w] = (freq[w]||0)+1;
    const sorted = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,15);
    const result = sorted.map(([w,c])=>`**${w}**: ${c}`).join("\n");
    message.reply({ embeds: [infoEmbed(`Word Frequency (${words.length} total)`, result)] });
  },
};
