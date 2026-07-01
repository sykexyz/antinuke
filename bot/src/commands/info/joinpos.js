import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "joinpos",
  description: "Shows what position a member joined the server at",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    const target = message.mentions.members.first() || message.member;
    await message.guild.members.fetch();
    const sorted = message.guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const pos = [...sorted.values()].findIndex(m => m.id === target.id) + 1;
    const embed = infoEmbed(`Join Position — ${target.user.username}`,
      `**${target.user.username}** was the **#${pos}** member to join **${message.guild.name}**.\n**Joined:** <t:${Math.floor(target.joinedTimestamp/1000)}:R>`
    );
    message.reply({ embeds: [embed] });
  },
};
