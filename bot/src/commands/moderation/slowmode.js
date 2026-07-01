import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "slowmode",
  description: "Set slowmode for this channel",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set slowmode for this channel")
    .addIntegerOption(opt => opt.setName("seconds").setDescription("Slowmode in seconds (0 to disable)").setRequired(true).setMinValue(0).setMaxValue(21600)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Manage Channels** permission.")], ephemeral: true });

    const seconds = interaction.options.getInteger("seconds");
    await interaction.channel.setRateLimitPerUser(seconds);
    await interaction.reply({ embeds: [successEmbed("Slowmode", seconds === 0 ? "Slowmode has been disabled." : `Slowmode set to **${seconds}s**.`)] });
  },
};
