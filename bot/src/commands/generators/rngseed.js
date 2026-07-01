import { infoEmbed, errorEmbed } from "../../utils/embed.js";

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default {
  name: "rngseed",
  description: "Seeded random number — same seed always gives same result",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 3) return message.reply("Usage: `!rngseed <seed> <min> <max>`");
    const seed = isNaN(parseInt(args[0])) ? args[0].split("").reduce((a,c)=>a+c.charCodeAt(0),0) : parseInt(args[0]);
    const min = parseInt(args[1]), max = parseInt(args[2]);
    if (isNaN(min)||isNaN(max)||min>=max) return message.reply({ embeds: [errorEmbed("Invalid", "Need valid seed, min and max.")] });
    const result = Math.floor(seededRandom(seed) * (max - min + 1)) + min;
    message.reply({ embeds: [infoEmbed("Seeded RNG", `🎲 **${result}**\n*Seed: \`${args[0]}\` — Range: ${min}–${max}*`)] });
  },
};
