import { infoEmbed, errorEmbed } from "../../utils/embed.js";

function safeMath(expr) {
  const clean = expr.replace(/[^0-9+\-*/.()^ ]/g, "").replace(/\^/g, "**").trim();
  if (!clean) throw new Error("Empty");
  return Function(`"use strict"; return (${clean})`)();
}

export default {
  name: "math",
  description: "Evaluates a math expression safely",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!math <expression>`\nExample: `!math (25 * 4) + 100 / 2`");
    try {
      const result = safeMath(args.join(" "));
      if (!isFinite(result)) return message.reply({ embeds: [errorEmbed("Math Error", "Result is infinite or undefined.")] });
      message.reply({ embeds: [infoEmbed("Math Evaluator", `**Expression:** \`${args.join(" ")}\`\n**Result:** \`${result}\``)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Invalid Expression", "Could not evaluate that expression.")] });
    }
  },
};
