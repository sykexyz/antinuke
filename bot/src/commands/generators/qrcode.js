import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "qrcode",
  description: "Generates a QR code from text or a URL",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!qrcode <text or URL>`");
    const data = encodeURIComponent(args.join(" "));
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${data}`;
    const embed = infoEmbed("QR Code", `**Data:** \`${decodeURIComponent(data).slice(0, 100)}\``).setImage(url);
    message.reply({ embeds: [embed] });
  },
};
