import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "starboard",
  description: "Configure the starboard — auto-pins popular messages",
  category: "social",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const sub = args[0]?.toLowerCase();
    if (!sub || sub === "status") {
      const res = await query("SELECT starboard_channel, starboard_threshold FROM guilds WHERE id = $1", [message.guild.id]);
      const row = res.rows[0];
      return message.reply({ embeds: [infoEmbed("Starboard Status",
        row?.starboard_channel ? `**Channel:** <#${row.starboard_channel}>\n**Threshold:** ${row.starboard_threshold || 3} ⭐` : "Starboard is not configured."
      )] });
    }
    if (sub === "set") {
      const channel = message.mentions.channels.first();
      const threshold = parseInt(args[2]) || 3;
      if (!channel) return message.reply("Usage: `!starboard set #channel [threshold]`");
      await query("UPDATE guilds SET starboard_channel = $1, starboard_threshold = $2 WHERE id = $3", [channel.id, threshold, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Starboard Configured ⭐", `Channel: <#${channel.id}>\nThreshold: **${threshold} stars**`)] });
    }
    if (sub === "disable") {
      await query("UPDATE guilds SET starboard_channel = NULL WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Starboard Disabled", "The starboard has been turned off.")] });
    }
    message.reply("Usage: `!starboard status` | `!starboard set #channel [stars]` | `!starboard disable`");
  },
};
