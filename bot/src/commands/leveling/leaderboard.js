import { EmbedBuilder } from "discord.js";
import { query } from "../../lib/db.js";

export default {
  name: "leaderboard",
  description: "View the XP leaderboard",
  usage: "!leaderboard",
  category: "leveling",
  ownerOnly: false,
  aliases: ["lb", "top"],
  cooldown: 10,
  async execute(message, args, client, config) {
    const res = await query(
      "SELECT user_id, xp, level FROM members WHERE guild_id = $1 ORDER BY xp DESC LIMIT 10",
      [message.guild.id]
    );
    if (!res.rows.length) return message.reply({ embeds: [{ color: 0xff3333, description: "No members found." }] });
    const rows = res.rows.map((r, i) => `**#${i + 1}** <@${r.user_id}> — Level **${r.level}** (${r.xp} XP)`).join("\n");
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`${message.guild.name} — XP Leaderboard`)
      .setDescription(rows)
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
