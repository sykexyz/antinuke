const up = ["̍","̎","̄","̅","̿","̑","̆","̐","͒","͗","͑","̇","̈","̊","͂","̓","̈́","͊","͋","͌","̃","̂","̌","͐","̀","́","̋","̏","̒","̓","̔","̽","̉","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","ͮ","ͯ","̾","͛","͆","̚"];
const mid = ["̕","̛","̀","́","͘","̡","̢","̧","̨","̴","̵","̶","͜","͝","͞","͟","͠","͢","̸","̷","͡"];
const down = ["̖","̗","̘","̙","̜","̝","̞","̟","̠","̤","̥","̦","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̹","̺","̻","̼","ͅ","͇","͈","͉","͍","͎","͓","͔","͕","͖","͙","͚","̣"];

function zalgo(text) {
  return text.split("").map(c => {
    if (c === " ") return c;
    let res = c;
    for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) res += up[Math.floor(Math.random() * up.length)];
    for (let i = 0; i < Math.floor(Math.random() * 2); i++) res += mid[Math.floor(Math.random() * mid.length)];
    for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) res += down[Math.floor(Math.random() * down.length)];
    return res;
  }).join("");
}

export default {
  name: "zalgo",
  description: "Converts text to cursed zalgo style",
  category: "text",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!zalgo <text>`");
    const text = args.join(" ").slice(0, 50);
    message.channel.send(zalgo(text));
  },
};
