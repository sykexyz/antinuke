import { EmbedBuilder } from "discord.js";

export default {
  name: "serverinfo",
  description: "View server information",
  usage: "!serverinfo",
  category: "utility",
  ownerOnly: false,
  aliases: ["si", "guildinfo"],
  cooldown: 5,
  async execute(message, args, client, config) {
    const g = message.guild;
    await g.fetch();
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(g.name)
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
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
