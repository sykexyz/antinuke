export default {
  name: "base64",
  description: "Encode or decode Base64",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!base64 encode <text>` or `!base64 decode <text>`");
    const mode = args[0].toLowerCase();
    const text = args.slice(1).join(" ");
    if (mode === "encode") {
      message.reply(`\`${Buffer.from(text).toString("base64")}\``);
    } else if (mode === "decode") {
      try {
        message.reply(`\`${Buffer.from(text, "base64").toString("utf-8")}\``);
      } catch { message.reply("❌ Invalid Base64 input."); }
    } else {
      message.reply("❌ Mode must be `encode` or `decode`.");
    }
  },
};
