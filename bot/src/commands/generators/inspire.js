import { primaryEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "inspire",
  description: "Sends a random inspirational quote",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    try {
      const res = await fetch("https://zenquotes.io/api/random");
      const [data] = await res.json();
      message.reply({ embeds: [primaryEmbed("Inspiration", `*"${data.q}"*\n\n— **${data.a}**`)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not fetch a quote right now.")] });
    }
  },
};
