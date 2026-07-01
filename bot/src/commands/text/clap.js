export default {
  name: "clap",
  description: "Adds 👏 between every word",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!clap <text>`");
    message.channel.send(args.join(" 👏 ") + " 👏");
  },
};
