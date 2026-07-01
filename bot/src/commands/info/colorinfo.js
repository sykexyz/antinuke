import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "color",
  description: "Shows info and preview for a hex color",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!color <#hex>`");
    let hex = args[0].replace("#", "").trim();
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return message.reply({ embeds: [errorEmbed("Invalid", "Provide a valid 6-digit hex color.")] });
    const r = parseInt(hex.slice(0,2),16), g = parseInt(hex.slice(2,4),16), b = parseInt(hex.slice(4,6),16);
    const decimal = parseInt(hex,16);
    const embed = infoEmbed(`Color — #${hex.toUpperCase()}`,
      `**Hex:** \`#${hex.toUpperCase()}\`\n**RGB:** \`rgb(${r}, ${g}, ${b})\`\n**Decimal:** \`${decimal}\`\n**Preview:** [Click here](https://www.colorhexa.com/${hex})`
    ).setColor(decimal).setThumbnail(`https://singlecolorimage.com/get/${hex}/100x100`);
    message.reply({ embeds: [embed] });
  },
};
