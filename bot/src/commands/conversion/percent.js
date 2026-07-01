import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "percent",
  description: "Percentage calculator — various modes",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply(
      "Usage:\n`!percent 20% of 150` → 30\n`!percent 30 is what% of 150` → 20%\n`!percent 150 + 20%` → 180\n`!percent 150 - 20%` → 120"
    );
    const input = args.join(" ").toLowerCase();
    let result;
    const m1 = input.match(/^([\d.]+)%\s*of\s*([\d.]+)$/);
    const m2 = input.match(/^([\d.]+)\s*is\s*what%?\s*of\s*([\d.]+)$/);
    const m3 = input.match(/^([\d.]+)\s*\+\s*([\d.]+)%$/);
    const m4 = input.match(/^([\d.]+)\s*-\s*([\d.]+)%$/);
    if (m1) result = `${m1[1]}% of ${m1[2]} = **${(parseFloat(m1[1])/100*parseFloat(m1[2])).toFixed(4).replace(/\.?0+$/,"")}**`;
    else if (m2) result = `${m2[1]} is **${(parseFloat(m2[1])/parseFloat(m2[2])*100).toFixed(2)}%** of ${m2[2]}`;
    else if (m3) { const v=parseFloat(m3[1]),p=parseFloat(m3[2]); result=`${v} + ${p}% = **${(v+v*p/100).toFixed(4).replace(/\.?0+$/,"")}**`; }
    else if (m4) { const v=parseFloat(m4[1]),p=parseFloat(m4[2]); result=`${v} − ${p}% = **${(v-v*p/100).toFixed(4).replace(/\.?0+$/,"")}**`; }
    else return message.reply({ embeds: [errorEmbed("Invalid", "Could not parse that. See `!percent` for usage.")] });
    message.reply({ embeds: [infoEmbed("Percentage Calculator", result)] });
  },
};
