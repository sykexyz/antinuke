import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "modlogsetup",
  description: "Configure the mod log channel",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    if (args[0] === "clear") {
      await query("UPDATE guilds SET mod_log_channel = NULL WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Mod Log Cleared", "Mod log channel has been removed.")] });
    }
    if (args[0] === "status") {
      const config = await getGuildConfig(message.guild.id);
      return message.reply({ embeds: [infoEmbed("Mod Log", config.mod_log_channel ? `Logging to <#${config.mod_log_channel}>` : "Not configured.")] });
    }
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Usage: `!modlogsetup #channel` | `!modlogsetup status` | `!modlogsetup clear`");
    await query("UPDATE guilds SET mod_log_channel = $1 WHERE id = $2", [channel.id, message.guild.id]);
    message.reply({ embeds: [successEmbed("Mod Log Set", `Mod actions will be logged in <#${channel.id}>.`)] });
  },
};
