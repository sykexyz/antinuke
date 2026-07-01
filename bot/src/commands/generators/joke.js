import { primaryEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "joke",
  description: "Sends a random joke with setup and punchline",
  category: "generators",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    try {
      const res = await fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist&type=twopart");
      const data = await res.json();
      if (data.error) throw new Error();
      message.reply({ embeds: [primaryEmbed("Joke 😂", `${data.setup}\n\n||${data.delivery}||`)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Error", "Could not fetch a joke.")] });
    }
  },
};
