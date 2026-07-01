import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "until",
  description: "Shows how many days until a future date",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!until <date>`\nExample: `!until 2025-12-25`");
    const target = new Date(args.join(" "));
    if (isNaN(target)) return message.reply({ embeds: [errorEmbed("Invalid", "Use YYYY-MM-DD format.")] });
    const now = new Date();
    const diff = target - now;
    if (diff < 0) return message.reply({ embeds: [errorEmbed("Past Date", "That date has already passed.")] });
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    message.reply({ embeds: [infoEmbed(`Countdown to ${target.toDateString()}`,
      `**${days}** days, **${hours}** hours, **${mins}** minutes remaining\n\n<t:${Math.floor(target.getTime()/1000)}:R>`
    )] });
  },
};
