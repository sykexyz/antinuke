import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "hexcolor",
  description: "Shows a color swatch image for a hex code",
  category: "extra",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!hexcolor <#hex>`");
    const hex = args[0].replace("#", "").trim();
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return message.reply({ embeds: [errorEmbed("Invalid", "Provide a 6-digit hex color.")] });
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    const embed = infoEmbed(`Color Swatch — #${hex.toUpperCase()}`,
      `**Hex:** \`#${hex.toUpperCase()}\`\n**RGB:** \`${r}, ${g}, ${b}\`\n**Decimal:** \`${parseInt(hex, 16)}\``
    ).setColor(parseInt(hex, 16)).setImage(`https://singlecolorimage.com/get/${hex}/400x100`);
    message.reply({ embeds: [embed] });
  },
};
