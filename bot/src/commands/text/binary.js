export default {
  name: "binary",
  description: "Converts text to binary or binary back to text",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!binary <text>` or `!binary decode <binary>`");
    if (args[0] === "decode") {
      const bin = args.slice(1).join(" ");
      try {
        const text = bin.split(" ").map(b => String.fromCharCode(parseInt(b, 2))).join("");
        return message.reply(`\`\`\`${text}\`\`\``);
      } catch { return message.reply("❌ Invalid binary input."); }
    }
    const text = args.join(" ").slice(0, 60);
    const result = text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    message.reply(`\`\`\`${result}\`\`\``);
  },
};
