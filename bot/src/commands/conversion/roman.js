import { infoEmbed, errorEmbed } from "../../utils/embed.js";

const VALS = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];

function toRoman(n) {
  if (n<1||n>3999) return null;
  let r="";
  for(const[v,s] of VALS){while(n>=v){r+=s;n-=v;}}
  return r;
}

function fromRoman(s) {
  const map={M:1000,D:500,C:100,L:50,X:10,V:5,I:1};
  let r=0;
  for(let i=0;i<s.length;i++){
    const cur=map[s[i]],nxt=map[s[i+1]];
    if(!cur) return null;
    r+=nxt>cur?-cur:cur;
  }
  return r;
}

export default {
  name: "roman",
  description: "Converts between numbers and Roman numerals",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!roman 42` or `!roman XLII`");
    const input = args[0].toUpperCase();
    if (/^\d+$/.test(args[0])) {
      const r = toRoman(parseInt(args[0]));
      if (!r) return message.reply({ embeds: [errorEmbed("Range Error", "Number must be 1–3999.")] });
      message.reply({ embeds: [infoEmbed("Roman Numerals", `**${args[0]}** → **${r}**`)] });
    } else {
      const n = fromRoman(input);
      if (!n) return message.reply({ embeds: [errorEmbed("Invalid", "Could not parse that Roman numeral.")] });
      message.reply({ embeds: [infoEmbed("Roman Numerals", `**${input}** → **${n}**`)] });
    }
  },
};
