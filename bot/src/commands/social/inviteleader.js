import { infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "inviteleader",
  description: "Shows the top inviters in this server",
  category: "social",
  prefix: true,
  cooldown: 10,
  async execute(message) {
    const res = await query(
      "SELECT user_id, invite_count FROM members WHERE guild_id = $1 AND invite_count > 0 ORDER BY invite_count DESC LIMIT 10",
      [message.guild.id]
    );
    if (!res.rows.length) return message.reply({ embeds: [infoEmbed("Invite Leaderboard", "No invite data yet.")] });
    const medals = ["🥇","🥈","🥉"];
    const list = res.rows.map((r, i) => `${medals[i] || `**${i+1}.**`} <@${r.user_id}> — **${r.invite_count}** invites`).join("\n");
    message.reply({ embeds: [infoEmbed(`Invite Leaderboard — ${message.guild.name}`, list)] });
  },
};
