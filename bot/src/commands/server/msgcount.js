import { infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "msgcount",
  description: "Shows how many messages a user has sent (tracked via XP)",
  category: "server",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const res = await query("SELECT xp, level FROM members WHERE user_id = $1 AND guild_id = $2", [target.id, message.guild.id]);
    const row = res.rows[0];
    const est = row ? Math.floor((row.xp + row.level * 100) / 20) : 0;
    message.reply({ embeds: [infoEmbed(`Message Stats — ${target.username}`,
      `**Estimated Messages:** ~${est.toLocaleString()}\n**XP:** ${row?.xp || 0}\n**Level:** ${row?.level || 0}\n*(Estimate based on XP earned)*`
    )] });
  },
};
