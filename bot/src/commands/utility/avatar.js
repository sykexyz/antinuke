import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "avatar",
  description: "View a user's avatar",
  category: "utility",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View a user's avatar")
    .addUserOption(opt => opt.setName("user").setDescription("Target user").setRequired(false)),
  async execute(interaction, client) {
    const target = interaction.options.getUser("user") || interaction.user;
    const url = target.displayAvatarURL({ dynamic: true, size: 4096 });
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${target.username}'s Avatar` })
      .setImage(url)
      .setURL(url)
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
