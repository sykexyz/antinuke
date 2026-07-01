import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "antispam",
  description: "Configure anti-spam settings",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const config = await getGuildConfig(message.guild.id);
    const sub = args[0]?.toLowerCase();
    if (!sub || sub === "status") {
      return message.reply({ embeds: [infoEmbed("Anti-Spam Status",
        `**Enabled:** ${config.spam_filter ? "✅ Yes" : "❌ No"}\n**Caps Filter:** ${config.caps_filter ? "✅ Yes" : "❌ No"}\n**Invite Filter:** ${config.invite_filter ? "✅ Yes" : "❌ No"}\n**Auto-Mod:** ${config.auto_mod_enabled ? "✅ Yes" : "❌ No"}`
      )] });
    }
    if (sub === "spam") {
      const val = args[1]?.toLowerCase() !== "off";
      await query("UPDATE guilds SET spam_filter = $1 WHERE id = $2", [val, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Anti-Spam", `Spam filter ${val ? "enabled ✅" : "disabled ❌"}.`)] });
    }
    if (sub === "caps") {
      const val = args[1]?.toLowerCase() !== "off";
      await query("UPDATE guilds SET caps_filter = $1 WHERE id = $2", [val, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Caps Filter", `Caps filter ${val ? "enabled ✅" : "disabled ❌"}.`)] });
    }
    if (sub === "invites") {
      const val = args[1]?.toLowerCase() !== "off";
      await query("UPDATE guilds SET invite_filter = $1 WHERE id = $2", [val, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Invite Filter", `Invite filter ${val ? "enabled ✅" : "disabled ❌"}.`)] });
    }
    message.reply("Usage: `!antispam status` | `!antispam spam [on/off]` | `!antispam caps [on/off]` | `!antispam invites [on/off]`");
  },
};
