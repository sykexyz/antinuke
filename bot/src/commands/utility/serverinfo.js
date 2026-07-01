import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "serverinfo",
  description: "View server information",
  category: "utility",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View server information"),
  async execute(interaction, client) {
    const g = interaction.guild;
    await g.fetch();
    const embed = new EmbedBuilder()
      .setColor(COLORS.primary)
      .setAuthor({ name: `◆  ${g.name}`, iconURL: g.iconURL({ dynamic: true }) })
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: "Owner", value: `<@${g.ownerId}>`, inline: true },
        { name: "Members", value: g.memberCount.toString(), inline: true },
        { name: "Channels", value: g.channels.cache.size.toString(), inline: true },
        { name: "Roles", value: g.roles.cache.size.toString(), inline: true },
        { name: "Boosts", value: g.premiumSubscriptionCount?.toString() || "0", inline: true },
        { name: "Boost Level", value: g.premiumTier.toString(), inline: true },
        { name: "Created", value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Verification", value: g.verificationLevel.toString(), inline: true },
        { name: "ID", value: g.id, inline: true },
      )
      .setFooter({ text: "SENTRIX" })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  },
};
