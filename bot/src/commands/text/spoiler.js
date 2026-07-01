export default {
  name: "spoiler",
  description: "Wraps text in a spoiler tag",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!spoiler <text>`");
    await message.delete().catch(() => {});
    message.channel.send(`**${message.author.username}:** ||${args.join(" ")}||`);
  },
};
