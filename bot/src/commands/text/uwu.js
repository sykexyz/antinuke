function uwuify(text) {
  return text
    .replace(/r|l/g, "w")
    .replace(/R|L/g, "W")
    .replace(/n([aeiou])/g, "ny$1")
    .replace(/N([aeiou])/g, "Ny$1")
    .replace(/ove/g, "uv")
    .replace(/th/g, "d")
    .replace(/Th/g, "D")
    .replace(/!/g, "! OwO")
    .replace(/\?/g, "? UwU");
}

const faces = ["OwO", "UwU", "^w^", ">w<", "✿", "~", "(◕ᴗ◕✿)"];

export default {
  name: "uwu",
  description: "Converts text to uwu speak",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!uwu <text>`");
    const face = faces[Math.floor(Math.random() * faces.length)];
    message.channel.send(`${uwuify(args.join(" "))} ${face}`);
  },
};
