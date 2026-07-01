export default {
  name: "reverse",
  description: "Reverses the given text",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!reverse <text>`");
    const text = args.join(" ").split("").reverse().join("");
    message.channel.send(`**${text}**`);
  },
};
