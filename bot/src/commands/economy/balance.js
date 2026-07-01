import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getMember } from "../../lib/db.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "balance",
  description: "Check your coin balance",
  category: "economy",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your coin balance")
    .addUserOption(opt => opt.setName("user").setDescription("Target user").setRequired(false)),
  async execute(interaction, client) {
    const user = interaction.options.getUser("user") || interaction.user;
    const target = await interaction.guild.members.fetch(user.id).catch(() => interaction.member);
    const member = await getMember(target.id, interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${user.username}'s Balance`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`**◦ Coins** — \`${member.coins || 0}\` 🪙`)
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
