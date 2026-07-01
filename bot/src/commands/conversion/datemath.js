import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "datemath",
  description: "Calculate the number of days between two dates",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!datemath <date1> <date2>`\nExample: `!datemath 2024-01-01 2025-01-01`");
    const d1 = new Date(args[0]), d2 = new Date(args[1]);
    if (isNaN(d1) || isNaN(d2)) return message.reply({ embeds: [errorEmbed("Invalid", "Use YYYY-MM-DD format.")] });
    const diff = Math.abs(d2 - d1);
    const days = Math.floor(diff / 86400000);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30.44);
    message.reply({ embeds: [infoEmbed("Date Calculator",
      `**From:** ${d1.toDateString()}\n**To:** ${d2.toDateString()}\n\n**Days:** ${days.toLocaleString()}\n**Weeks:** ${weeks.toLocaleString()}\n**Months (approx):** ${months}`
    )] });
  },
};
