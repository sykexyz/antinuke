export default {
  name: "strike",
  description: "Formats text with strikethrough",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!strike <text>`");
    message.channel.send(`~~${args.join(" ")}~~`);
  },
};
