import { EmbedBuilder } from "discord.js";

export default {
  name: "ship",
  description: "Ship two users together",
  usage: "!ship @user1 @user2",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    const u1 = message.mentions.users.first() || message.author;
    const u2 = message.mentions.users.at(1) || message.author;
    const seed = (u1.id + u2.id).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const pct = seed % 101;
    const bar = "█".repeat(Math.floor(pct / 10)) + "░".repeat(10 - Math.floor(pct / 10));
    const embed = new EmbedBuilder()
      .setColor(0xff69b4)
      .setTitle("Compatibility")
      .setDescription(`**${u1.username}** ❤️ **${u2.username}**\n\n[${bar}] **${pct}%**\n\n${pct >= 80 ? "A perfect match!" : pct >= 50 ? "Pretty good!" : pct >= 30 ? "Could work..." : "Not looking great..."}`)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
