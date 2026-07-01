export default {
  name: "mock",
  description: "SpOnGeBoB mocking text",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!mock <text>`");
    const text = args.join(" ").split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("");
    message.channel.send(`**${text}**`);
  },
};
