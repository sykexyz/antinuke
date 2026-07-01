import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "translate",
  description: "Translates text to another language using LibreTranslate",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!translate <lang> <text>`\nExamples: `!translate es Hello` | `!translate ja Good morning`\nLangs: en, es, fr, de, ja, zh, ar, ru, pt, ko, it, tl");
    const target = args[0].toLowerCase();
    const text = args.slice(1).join(" ").slice(0, 500);
    try {
      const res = await fetch("https://translate.argosopentech.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, source: "auto", target, format: "text" }),
      });
      const data = await res.json();
      if (!data.translatedText) throw new Error("no result");
      message.reply({ embeds: [infoEmbed(`Translate → ${target.toUpperCase()}`,
        `**Original:** ${text.slice(0, 200)}\n**Translated:** ${data.translatedText}`
      )] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Translation failed. Try again or check the language code.")] });
    }
  },
};
