import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getGuildConfig } from "../../lib/db.js";

export default {
  name: "clonechannel",
  description: "Duplicates a channel with the same settings",
  category: "server",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    const channel = message.mentions.channels.first() || message.channel;
    try {
      const clone = await channel.clone({ name: args[1] || `${channel.name}-clone` });
      message.reply({ embeds: [successEmbed("Channel Cloned", `**${channel.name}** → <#${clone.id}>`)] });
    } catch (e) {
      message.reply({ embeds: [errorEmbed("Failed", e.message)] });
    }
  },
};
