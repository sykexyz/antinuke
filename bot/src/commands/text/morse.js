const encode = {a:".-",b:"-...",c:"-.-.",d:"-..",e:".",f:"..-.",g:"--.",h:"....",i:"..",j:".---",k:"-.-",l:".-..",m:"--",n:"-.",o:"---",p:".--.",q:"--.-",r:".-.",s:"...",t:"-",u:"..-",v:"...-",w:".--",x:"-..-",y:"-.--",z:"--..",0:"-----",1:".----",2:"..---",3:"...--",4:"....-",5:".....",6:"-....",7:"--...",8:"---..",9:"----."};
const decode = Object.fromEntries(Object.entries(encode).map(([k,v])=>[v,k]));

export default {
  name: "morse",
  description: "Encode or decode Morse code",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args.length < 2) return message.reply("Usage: `!morse encode <text>` or `!morse decode <.- -...>`");
    const mode = args[0].toLowerCase();
    const text = args.slice(1).join(" ");
    if (mode === "encode") {
      const result = text.toLowerCase().split("").map(c => c === " " ? "/" : encode[c] || "?").join(" ");
      message.reply(`\`${result}\``);
    } else if (mode === "decode") {
      const result = text.split(" / ").map(word => word.split(" ").map(s => decode[s] || "?").join("")).join(" ");
      message.reply(`\`${result}\``);
    } else {
      message.reply("❌ Mode must be `encode` or `decode`.");
    }
  },
};
