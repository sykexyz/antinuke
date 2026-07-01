import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "bin2dec",
  description: "Converts binary to decimal and back",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!bin2dec bin <value>` or `!bin2dec dec <value>`");
    const mode = args[0].toLowerCase();
    const val = args[1];
    if (mode === "bin") {
      if (!/^[01]+$/.test(val)) return message.reply({ embeds: [errorEmbed("Invalid", "Binary must contain only 0s and 1s.")] });
      message.reply({ embeds: [infoEmbed("Binary → Decimal", `**Binary:** \`${val}\`\n**Decimal:** \`${parseInt(val,2)}\``)] });
    } else if (mode === "dec") {
      const n = parseInt(val);
      if (isNaN(n)||n<0) return message.reply({ embeds: [errorEmbed("Invalid", "Must be a positive decimal number.")] });
      message.reply({ embeds: [infoEmbed("Decimal → Binary", `**Decimal:** \`${n}\`\n**Binary:** \`${n.toString(2)}\``)] });
    } else {
      message.reply("❌ Mode must be `bin` or `dec`.");
    }
  },
};
