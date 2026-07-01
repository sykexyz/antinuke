function toPigLatin(word) {
  const vowels = "aeiouAEIOU";
  if (!word.match(/[a-zA-Z]/)) return word;
  if (vowels.includes(word[0])) return word + "yay";
  let i = 0;
  while (i < word.length && !vowels.includes(word[i])) i++;
  return word.slice(i) + word.slice(0, i) + "ay";
}

export default {
  name: "piglatin",
  description: "Converts text to Pig Latin",
  category: "text",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!piglatin <text>`");
    const result = args.map(toPigLatin).join(" ");
    message.channel.send(result);
  },
};
