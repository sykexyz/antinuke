function shift(text, n) {
  return text.replace(/[a-zA-Z]/g, c => {
    const base = c <= "Z" ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + n + 26) % 26) + base);
  });
}

export default {
  name: "caesar",
  description: "Caesar cipher — encrypt or decode text",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!caesar <shift> <text>` (use negative shift to decode)");
    const n = parseInt(args[0]);
    if (isNaN(n)) return message.reply("❌ Shift must be a number.");
    const result = shift(args.slice(1).join(" "), n);
    message.reply(`\`${result}\``);
  },
};
