import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "placeholder",
  description: "Generates a placeholder image of a given size",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!placeholder <width>x<height>` e.g. `!placeholder 800x600`");
    const match = args[0].match(/^(\d+)x(\d+)$/i);
    if (!match) return message.reply({ embeds: [errorEmbed("Invalid", "Format: `!placeholder 800x600`")] });
    const [, w, h] = match;
    if (parseInt(w) > 2000 || parseInt(h) > 2000) return message.reply({ embeds: [errorEmbed("Too Large", "Max size is 2000x2000.")] });
    const bg = args[1]?.replace("#","") || "7c4dff";
    const text = args.slice(2).join("+") || `${w}x${h}`;
    const url = `https://placehold.co/${w}x${h}/${bg}/ffffff.png?text=${encodeURIComponent(text)}`;
    message.reply({ embeds: [infoEmbed("Placeholder Image", `**Size:** ${w}×${h}`).setImage(url)] });
  },
};
