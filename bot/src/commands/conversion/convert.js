import { infoEmbed, errorEmbed } from "../../utils/embed.js";

const conversions = {
  km: { mi: 0.621371, m: 1000, ft: 3280.84, yd: 1093.61 },
  mi: { km: 1.60934, m: 1609.34, ft: 5280, yd: 1760 },
  m: { km: 0.001, mi: 0.000621371, ft: 3.28084, cm: 100 },
  cm: { m: 0.01, in: 0.393701, mm: 10 },
  ft: { m: 0.3048, in: 12, cm: 30.48, mi: 0.000189394 },
  in: { cm: 2.54, ft: 0.0833333, mm: 25.4 },
  kg: { lb: 2.20462, g: 1000, oz: 35.274 },
  lb: { kg: 0.453592, g: 453.592, oz: 16 },
  g: { kg: 0.001, lb: 0.00220462, oz: 0.035274 },
  oz: { g: 28.3495, lb: 0.0625, kg: 0.0283495 },
  l: { ml: 1000, gal: 0.264172, fl_oz: 33.814 },
  ml: { l: 0.001, fl_oz: 0.033814, tsp: 0.202884 },
  gal: { l: 3.78541, qt: 4, pt: 8 },
};

export default {
  name: "convert",
  description: "Unit converter — km, mi, m, ft, kg, lb, etc.",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 3) return message.reply("Usage: `!convert <value> <from> <to>`\nExample: `!convert 10 km mi`");
    const value = parseFloat(args[0]);
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();
    if (isNaN(value)) return message.reply({ embeds: [errorEmbed("Invalid", "Value must be a number.")] });
    if (!conversions[from]) return message.reply({ embeds: [errorEmbed("Unknown Unit", `Unit \`${from}\` not recognized.`)] });
    if (!conversions[from][to]) return message.reply({ embeds: [errorEmbed("No Conversion", `Cannot convert \`${from}\` to \`${to}\`.`)] });
    const result = (value * conversions[from][to]).toFixed(4).replace(/\.?0+$/, "");
    message.reply({ embeds: [infoEmbed("Unit Converter", `**${value} ${from}** = **${result} ${to}**`)] });
  },
};
