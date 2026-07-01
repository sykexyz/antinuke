import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "age",
  description: "Calculates age from a birthdate",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!age <YYYY-MM-DD>`");
    const birth = new Date(args[0]);
    if (isNaN(birth)) return message.reply({ embeds: [errorEmbed("Invalid", "Use YYYY-MM-DD format.")] });
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    const next = new Date(birth);
    next.setFullYear(now.getFullYear() + (years >= 0 ? 1 : 0));
    if (next < now) next.setFullYear(next.getFullYear() + 1);
    const daysLeft = Math.floor((next - now) / 86400000);
    message.reply({ embeds: [infoEmbed("Age Calculator",
      `**Birthdate:** ${birth.toDateString()}\n**Age:** ${years} years old\n**Next Birthday:** in ${daysLeft} days`
    )] });
  },
};
