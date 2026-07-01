import { EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";

export default {
  name: "balance",
  description: "Check your coin balance",
  usage: "!balance [@user]",
  category: "economy",
  ownerOnly: false,
  aliases: ["bal", "coins"],
  cooldown: 5,
  async execute(message, args, client, config) {
    const target = message.mentions.members.first() || message.member;
    const member = await getMember(target.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`${target.user.username}'s Balance`)
      .setDescription(`**${member.coins || 0}** coins`)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
