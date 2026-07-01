export default {
  name: "repeat",
  description: "Repeats text N times",
  category: "text",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!repeat <count> <text>`");
    const count = Math.min(parseInt(args[0]) || 1, 10);
    if (isNaN(count) || count < 1) return message.reply("❌ Count must be 1–10.");
    const text = args.slice(1).join(" ").slice(0, 100);
    message.channel.send(Array(count).fill(text).join("\n"));
  },
};
