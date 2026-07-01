import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "ascii",
  description: "Shows ASCII value of characters (or char from code)",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!ascii <text>` or `!ascii code <number>`");
    if (args[0] === "code") {
      const code = parseInt(args[1]);
      if (isNaN(code)||code<0||code>127) return message.reply({ embeds: [errorEmbed("Invalid", "Code must be 0–127.")] });
      return message.reply({ embeds: [infoEmbed("ASCII Code", `Code **${code}** → Character **\`${String.fromCharCode(code)}\`**`)] });
    }
    const text = args.join(" ").slice(0,20);
    const result = text.split("").map(c=>`\`${c}\`→${c.charCodeAt(0)}`).join("  ");
    message.reply({ embeds: [infoEmbed("ASCII Values", result)] });
  },
};
