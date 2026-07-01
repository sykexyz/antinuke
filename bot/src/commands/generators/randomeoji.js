const EMOJIS = ["😂","🤣","😊","😍","🥰","😎","🤩","🥳","😜","🤪","😱","🤯","🥶","🔥","💯","✨","🎉","🎊","🎸","🎮","🦊","🦁","🐉","🌈","🍕","🍣","🍜","🚀","⚡","💎","👑","🌙","☀️","🌊","🍀","🦋","🐝","🎭","🎨","🎵","🏆","💪","🙌","👾","🤖","🦄","🌺","🍄","🎯","🧩"];

export default {
  name: "randomeoji",
  description: "Sends one or more random emojis",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const count = Math.min(parseInt(args[0]) || 1, 20);
    const result = Array.from({ length: count }, () => EMOJIS[Math.floor(Math.random()*EMOJIS.length)]).join(" ");
    message.channel.send(result);
  },
};
