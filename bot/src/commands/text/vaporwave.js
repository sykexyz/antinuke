function toVaporwave(text) {
  return text.split("").map(c => {
    const code = c.charCodeAt(0);
    if (code >= 33 && code <= 126) return String.fromCharCode(code + 65248);
    if (c === " ") return "\u3000";
    return c;
  }).join("");
}

export default {
  name: "vaporwave",
  description: "Converts text to ｆｕｌｌｗｉｄｔｈ vaporwave style",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!vaporwave <text>`");
    message.channel.send(toVaporwave(args.join(" ")));
  },
};
