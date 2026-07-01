import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "hex2dec",
  description: "Converts hex to decimal and back",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!hex2dec hex <value>` or `!hex2dec dec <value>`");
    const mode = args[0].toLowerCase();
    const val = args[1].replace("#","");
    if (mode === "hex") {
      if (!/^[0-9a-fA-F]+$/.test(val)) return message.reply({ embeds: [errorEmbed("Invalid", "Not a valid hex value.")] });
      message.reply({ embeds: [infoEmbed("Hex → Decimal", `**Hex:** \`${val.toUpperCase()}\`\n**Decimal:** \`${parseInt(val,16)}\``)] });
    } else if (mode === "dec") {
      const n = parseInt(val);
      if (isNaN(n)) return message.reply({ embeds: [errorEmbed("Invalid", "Not a valid decimal.")] });
      message.reply({ embeds: [infoEmbed("Decimal → Hex", `**Decimal:** \`${n}\`\n**Hex:** \`${n.toString(16).toUpperCase()}\``)] });
    } else {
      message.reply("❌ Mode must be `hex` or `dec`.");
    }
  },
};
