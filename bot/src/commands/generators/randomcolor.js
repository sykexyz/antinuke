import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "randomcolor",
  description: "Generates a random color with hex and RGB",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message) {
    const r = Math.floor(Math.random()*256), g = Math.floor(Math.random()*256), b = Math.floor(Math.random()*256);
    const hex = ((r<<16)|(g<<8)|b).toString(16).padStart(6,"0");
    const embed = infoEmbed("Random Color", `**Hex:** \`#${hex.toUpperCase()}\`\n**RGB:** \`rgb(${r}, ${g}, ${b})\``)
      .setColor(parseInt(hex,16))
      .setThumbnail(`https://singlecolorimage.com/get/${hex}/100x100`);
    message.reply({ embeds: [embed] });
  },
};
