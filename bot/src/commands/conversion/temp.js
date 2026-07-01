import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "temp",
  description: "Temperature converter — C, F, K",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!temp <value> <C|F|K>`\nExample: `!temp 100 C`");
    const val = parseFloat(args[0]);
    const unit = args[1].toUpperCase();
    if (isNaN(val)) return message.reply({ embeds: [errorEmbed("Invalid", "Value must be a number.")] });
    let c, f, k;
    if (unit === "C") { c = val; f = val * 9/5 + 32; k = val + 273.15; }
    else if (unit === "F") { f = val; c = (val - 32) * 5/9; k = c + 273.15; }
    else if (unit === "K") { k = val; c = val - 273.15; f = c * 9/5 + 32; }
    else return message.reply({ embeds: [errorEmbed("Invalid Unit", "Use C, F, or K.")] });
    message.reply({ embeds: [infoEmbed("Temperature Converter",
      `🌡️ **${val}°${unit}** is equal to:\n\n**Celsius:** ${c.toFixed(2)}°C\n**Fahrenheit:** ${f.toFixed(2)}°F\n**Kelvin:** ${k.toFixed(2)} K`
    )] });
  },
};
