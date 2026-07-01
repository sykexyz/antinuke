import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "urlencode",
  description: "URL-encodes or decodes text",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!urlencode encode <text>` or `!urlencode decode <text>`");
    const mode = args[0].toLowerCase();
    const text = args.slice(1).join(" ");
    if (mode === "encode") {
      message.reply(`\`${encodeURIComponent(text)}\``);
    } else if (mode === "decode") {
      try { message.reply(`\`${decodeURIComponent(text)}\``); }
      catch { message.reply({ embeds: [errorEmbed("Invalid", "Could not decode that URL string.")] }); }
    } else {
      message.reply("❌ Mode must be `encode` or `decode`.");
    }
  },
};
