const map = {
  a:"🇦",b:"🇧",c:"🇨",d:"🇩",e:"🇪",f:"🇫",g:"🇬",h:"🇭",i:"🇮",j:"🇯",k:"🇰",l:"🇱",m:"🇲",
  n:"🇳",o:"🇴",p:"🇵",q:"🇶",r:"🇷",s:"🇸",t:"🇹",u:"🇺",v:"🇻",w:"🇼",x:"🇽",y:"🇾",z:"🇿",
  "0":"0️⃣","1":"1️⃣","2":"2️⃣","3":"3️⃣","4":"4️⃣","5":"5️⃣","6":"6️⃣","7":"7️⃣","8":"8️⃣","9":"9️⃣",
  "!":"❗","?":"❓"," ":"   ",
};

export default {
  name: "emojify",
  description: "Converts text to emoji letters",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!emojify <text>`");
    const text = args.join(" ").toLowerCase().slice(0, 30);
    const result = text.split("").map(c => map[c] || c).join(" ");
    message.channel.send(result);
  },
};
