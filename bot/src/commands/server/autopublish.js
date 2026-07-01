import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

const enabled = new Set();

export default {
  name: "autopublish",
  description: "Toggles auto-publishing messages in an announcement channel",
  category: "server",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    if (message.channel.type !== 5) return message.reply({ embeds: [errorEmbed("Wrong Channel", "This command only works in Announcement channels.")] });
    const key = message.channel.id;
    if (enabled.has(key)) {
      enabled.delete(key);
      message.reply({ embeds: [errorEmbed("Auto-Publish Off", `Auto-publishing disabled in <#${message.channel.id}>.`)] });
    } else {
      enabled.add(key);
      message.reply({ embeds: [successEmbed("Auto-Publish On", `All new messages in <#${message.channel.id}> will be auto-published.`)] });
    }
  },
  isEnabled: (channelId) => enabled.has(channelId),
};
