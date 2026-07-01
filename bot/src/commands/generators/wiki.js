import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "wiki",
  description: "Shows a random Wikipedia article summary",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    try {
      let url = "https://en.wikipedia.org/api/rest_v1/page/random/summary";
      if (args.length) {
        const q = encodeURIComponent(args.join(" "));
        url = `https://en.wikipedia.org/api/rest_v1/page/summary/${q}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.type === "disambiguation" || !data.extract) return message.reply({ embeds: [errorEmbed("Not Found", "No summary available.")] });
      const embed = infoEmbed(data.title, data.extract.slice(0, 1000) + (data.extract.length > 1000 ? "..." : ""))
        .setURL(data.content_urls?.desktop?.page || "")
        .setThumbnail(data.thumbnail?.source || null);
      message.reply({ embeds: [embed] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not fetch Wikipedia.")] });
    }
  },
};
