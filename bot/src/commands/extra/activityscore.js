import { infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "activityscore",
  description: "Shows server activity score based on XP and member engagement",
  category: "extra",
  prefix: true,
  cooldown: 10,
  async execute(message) {
    const res = await query(
      "SELECT COUNT(*) as active, SUM(xp) as total_xp, AVG(xp) as avg_xp FROM members WHERE guild_id = $1 AND xp > 0",
      [message.guild.id]
    );
    const { active, total_xp, avg_xp } = res.rows[0];
    const totalMembers = message.guild.memberCount;
    const activeCount = parseInt(active) || 0;
    const totalXp = parseInt(total_xp) || 0;
    const avgXp = parseFloat(avg_xp) || 0;
    const engagementRate = totalMembers ? ((activeCount / totalMembers) * 100).toFixed(1) : 0;
    const score = Math.min(Math.floor((avgXp / 100) * (engagementRate / 100) * 1000), 10000);
    const bars = Math.floor(score / 1000);
    const bar = "▓".repeat(bars) + "░".repeat(10 - bars);
    message.reply({ embeds: [infoEmbed(`Activity Score — ${message.guild.name}`,
      `[${bar}] **${score}/10000**\n\n**Active Members:** ${activeCount} / ${totalMembers}\n**Engagement Rate:** ${engagementRate}%\n**Total XP:** ${totalXp.toLocaleString()}\n**Avg XP/Member:** ${avgXp.toFixed(0)}`
    )] });
  },
};
