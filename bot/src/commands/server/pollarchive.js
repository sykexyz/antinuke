import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "pollarchive",
  description: "Sets or clears the channel where poll results are logged",
  category: "server",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    if (args[0] === "clear") {
      await query("UPDATE guilds SET log_channel = NULL WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Poll Archive Cleared", "Poll results will no longer be logged.")] });
    }
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Usage: `!pollarchive #channel` or `!pollarchive clear`");
    await query("UPDATE guilds SET log_channel = $1 WHERE id = $2", [channel.id, message.guild.id]);
    message.reply({ embeds: [successEmbed("Poll Archive Set", `Poll results will be logged in <#${channel.id}>.`)] });
  },
};
