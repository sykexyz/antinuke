import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "autoresponder",
  description: "Manage keyword auto-responses",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const sub = args[0]?.toLowerCase();
    const config = await getGuildConfig(message.guild.id);
    const ar = config.auto_responder && typeof config.auto_responder === "object" ? config.auto_responder : {};
    if (!sub || sub === "list") {
      const entries = Object.entries(ar);
      if (!entries.length) return message.reply({ embeds: [infoEmbed("Auto-Responder", "No auto-responses configured.")] });
      const list = entries.map(([k, v]) => `**"${k}"** → ${v.slice(0, 50)}`).join("\n");
      return message.reply({ embeds: [infoEmbed(`Auto-Responder (${entries.length})`, list)] });
    }
    if (sub === "add") {
      if (args.length < 3) return message.reply("Usage: `!autoresponder add <keyword> <response>`");
      const keyword = args[1].toLowerCase();
      const response = args.slice(2).join(" ");
      ar[keyword] = response;
      await query("UPDATE guilds SET auto_responder = $1::jsonb WHERE id = $2", [JSON.stringify(ar), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Auto-Response Added", `Keyword: **"${keyword}"** → **${response.slice(0, 100)}**`)] });
    }
    if (sub === "remove") {
      const keyword = args[1]?.toLowerCase();
      if (!keyword || !ar[keyword]) return message.reply({ embeds: [errorEmbed("Not Found", `Keyword \`${keyword}\` not found.`)] });
      delete ar[keyword];
      await query("UPDATE guilds SET auto_responder = $1::jsonb WHERE id = $2", [JSON.stringify(ar), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Removed", `Auto-response for **"${keyword}"** deleted.`)] });
    }
    if (sub === "clear") {
      await query("UPDATE guilds SET auto_responder = '{}'::jsonb WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Cleared", "All auto-responses removed.")] });
    }
    message.reply("Usage: `!autoresponder list` | `!autoresponder add <keyword> <response>` | `!autoresponder remove <keyword>` | `!autoresponder clear`");
  },
};
