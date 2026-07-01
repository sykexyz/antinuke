import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "urban",
  description: "Looks up a term on Urban Dictionary",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!urban <term>`");
    const term = args.join(" ");
    try {
      const res = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`);
      const data = await res.json();
      if (!data.list?.length) return message.reply({ embeds: [errorEmbed("Not Found", `No definition found for **${term}**.`)] });
      const def = data.list[0];
      const definition = def.definition.replace(/\[|\]/g, "").slice(0, 800);
      const example = def.example?.replace(/\[|\]/g, "").slice(0, 300) || "No example.";
      const embed = infoEmbed(`Urban Dictionary — ${def.word}`,
        `${definition}\n\n**Example:**\n*${example}*`
      ).setURL(def.permalink).setFooter({ text: `👍 ${def.thumbs_up}  👎 ${def.thumbs_down}  •  SENTRIX` });
      message.reply({ embeds: [embed] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not reach Urban Dictionary.")] });
    }
  },
};
