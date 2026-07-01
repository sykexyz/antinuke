import { primaryEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "dadjoke",
  description: "Sends a random dad joke",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    try {
      const res = await fetch("https://icanhazdadjoke.com/", { headers: { Accept: "application/json" } });
      const data = await res.json();
      message.reply({ embeds: [primaryEmbed("Dad Joke 👴", data.joke)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not fetch a dad joke.")] });
    }
  },
};
