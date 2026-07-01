import { EmbedBuilder } from "discord.js";

const responses = [
  "It is certain.", "It is decidedly so.", "Without a doubt.", "Yes definitely.",
  "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.",
  "Yes.", "Signs point to yes.", "Reply hazy, try again.", "Ask again later.",
  "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.",
  "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."
];

export default {
  name: "8ball",
  description: "Ask the magic 8ball a question",
  usage: "!8ball <question>",
  category: "fun",
  ownerOnly: false,
  aliases: ["eightball"],
  cooldown: 3,
  async execute(message, args, client, config) {
    if (!args.length) return message.reply({ embeds: [{ color: 0xff3333, description: "Ask me a question!" }] });
    const response = responses[Math.floor(Math.random() * responses.length)];
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle("Magic 8Ball")
      .setDescription(`**Question:** ${args.join(" ")}\n\n**Answer:** ${response}`)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
