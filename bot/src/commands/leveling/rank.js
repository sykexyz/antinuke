import { EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";
import { xpForLevel } from "../../utils/xp.js";

export default {
  name: "rank",
  description: "View your XP rank",
  usage: "!rank [@user]",
  category: "leveling",
  ownerOnly: false,
  aliases: ["xp", "level"],
  cooldown: 5,
  async execute(message, args, client, config) {
    const target = message.mentions.members.first() || message.member;
    const member = await getMember(target.id, message.guild.id);
    const needed = xpForLevel(member.level || 0);
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`${target.user.username}'s Rank`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "Level", value: (member.level || 0).toString(), inline: true },
        { name: "XP", value: `${member.xp || 0} / ${needed}`, inline: true },
        { name: "Coins", value: (member.coins || 0).toString(), inline: true },
      )
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
