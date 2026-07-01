import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "fact",
  description: "Shows a random interesting fact",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    try {
      const res = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      const data = await res.json();
      message.reply({ embeds: [infoEmbed("Random Fact", data.text)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not fetch a fact right now.")] });
    }
  },
};
