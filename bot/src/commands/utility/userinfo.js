import { EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";

export default {
  name: "userinfo",
  description: "View user information",
  usage: "!userinfo [@user]",
  category: "utility",
  ownerOnly: false,
  aliases: ["ui", "whois"],
  cooldown: 5,
  async execute(message, args, client, config) {
    const target = message.mentions.members.first() || message.member;
    const dbMember = await getMember(target.id, message.guild.id);
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(target.user.tag)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: target.id, inline: true },
        { name: "Nickname", value: target.nickname || "None", inline: true },
        { name: "Bot", value: target.user.bot ? "Yes" : "No", inline: true },
        { name: "Joined", value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: "Created", value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "XP", value: dbMember.xp?.toString() || "0", inline: true },
        { name: "Level", value: dbMember.level?.toString() || "0", inline: true },
        { name: "Coins", value: dbMember.coins?.toString() || "0", inline: true },
        { name: "Warns", value: dbMember.warns?.toString() || "0", inline: true },
        { name: "Top Role", value: target.roles.highest.name, inline: true },
      )
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
