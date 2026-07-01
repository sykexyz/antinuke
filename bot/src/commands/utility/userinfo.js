import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "userinfo",
  description: "View user information",
  category: "utility",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("View user information")
    .addUserOption(opt => opt.setName("user").setDescription("Target user").setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const target = await interaction.guild.members.fetch(user.id).catch(() => null) || interaction.member;
    const dbMember = await getMember(target.id, interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${target.user.username}`, iconURL: target.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "ID", value: target.id, inline: true },
        { name: "Nickname", value: target.nickname || "None", inline: true },
        { name: "Bot", value: target.user.bot ? "Yes" : "No", inline: true },
        { name: "Joined", value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: "Created", value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Top Role", value: target.roles.highest.name, inline: true },
        { name: "XP", value: dbMember.xp?.toString() || "0", inline: true },
        { name: "Level", value: dbMember.level?.toString() || "0", inline: true },
        { name: "Coins", value: dbMember.coins?.toString() || "0", inline: true },
        { name: "Warns", value: dbMember.warns?.toString() || "0", inline: true },
      )
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
