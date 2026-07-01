import { EmbedBuilder } from "discord.js";

export default {
  name: "calc",
  description: "Calculate a math expression",
  usage: "!calc <expression>",
  category: "utility",
  ownerOnly: false,
  aliases: ["calculator", "math"],
  cooldown: 3,
  async execute(message, args, client, config) {
    const expr = args.join(" ").replace(/[^0-9+\-*/().% ]/g, "");
    if (!expr) return message.reply({ embeds: [{ color: 0xff3333, description: "Provide a math expression." }] });
    try {
      const result = Function(`"use strict"; return (${expr})`)();
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Calculator")
        .setDescription(`**Expression:** \`${expr}\`\n**Result:** \`${result}\``)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch {
      await message.reply({ embeds: [{ color: 0xff3333, description: "Invalid expression." }] });
    }
  },
};
