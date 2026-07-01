import { infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "topwarned",
  description: "Shows the most warned users in this server",
  category: "extra",
  prefix: true,
  cooldown: 10,
  async execute(message) {
    if (!message.member.permissions.has("ManageMessages")) return message.reply("❌ You need Manage Messages permission.");
    const res = await query(
      "SELECT user_id, warns FROM members WHERE guild_id = $1 AND warns > 0 ORDER BY warns DESC LIMIT 10",
      [message.guild.id]
    );
    if (!res.rows.length) return message.reply({ embeds: [infoEmbed("Most Warned", "No members have warnings.")] });
    const list = res.rows.map((r, i) => `**${i+1}.** <@${r.user_id}> — **${r.warns}** warns`).join("\n");
    message.reply({ embeds: [infoEmbed(`Most Warned — ${message.guild.name}`, list)] });
  },
};
