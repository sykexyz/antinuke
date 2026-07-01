import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "antialt",
  description: "Kicks accounts newer than X days on join — set 0 to disable",
  category: "server",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    if (!args.length) {
      const res = await query("SELECT account_age_filter FROM guilds WHERE id = $1", [message.guild.id]);
      const days = res.rows[0]?.account_age_filter || 0;
      return message.reply({ embeds: [infoEmbed("Anti-Alt Status", days ? `Accounts newer than **${days} days** are kicked on join.` : "Anti-alt is currently **disabled**.")] });
    }
    const days = parseInt(args[0]);
    if (isNaN(days) || days < 0 || days > 365) return message.reply({ embeds: [errorEmbed("Invalid", "Days must be 0–365. Use 0 to disable.")] });
    await query("UPDATE guilds SET account_age_filter = $1 WHERE id = $2", [days, message.guild.id]);
    message.reply({ embeds: [days ? successEmbed("Anti-Alt Enabled", `Accounts newer than **${days} days** will be kicked on join.`) : infoEmbed("Anti-Alt Disabled", "New accounts will no longer be kicked.")] });
  },
};
