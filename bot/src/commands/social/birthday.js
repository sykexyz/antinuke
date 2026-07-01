import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "birthday",
  description: "Set or view your birthday — auto-announced on the day",
  category: "social",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!args.length || args[0] === "view") {
      const target = message.mentions.users.first() || message.author;
      const member = await getMember(target.id, message.guild.id);
      if (!member.birthday) return message.reply({ embeds: [infoEmbed("Birthday", target.id === message.author.id ? "You haven't set your birthday. Use `!birthday set MM-DD`." : `${target.username} hasn't set their birthday.`)] });
      const [mm, dd] = member.birthday.split("-");
      const now = new Date();
      const next = new Date(now.getFullYear(), parseInt(mm)-1, parseInt(dd));
      if (next < now) next.setFullYear(next.getFullYear()+1);
      const days = Math.floor((next-now)/86400000);
      return message.reply({ embeds: [infoEmbed(`🎂 ${target.username}'s Birthday`, `**Date:** ${member.birthday}\n**Next birthday:** in ${days} days`)] });
    }
    if (args[0] === "set") {
      const date = args[1];
      if (!date?.match(/^\d{2}-\d{2}$/)) return message.reply({ embeds: [errorEmbed("Invalid Format", "Use `MM-DD` e.g. `!birthday set 05-20`")] });
      const [mm, dd] = date.split("-").map(Number);
      if (mm<1||mm>12||dd<1||dd>31) return message.reply({ embeds: [errorEmbed("Invalid Date", "Check month (01-12) and day (01-31).")] });
      await query("UPDATE members SET birthday = $1 WHERE user_id = $2 AND guild_id = $3", [date, message.author.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Birthday Set 🎂", `Your birthday is set to **${date}**. We'll celebrate!`)] });
    }
    if (args[0] === "clear") {
      await query("UPDATE members SET birthday = NULL WHERE user_id = $1 AND guild_id = $2", [message.author.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Birthday Cleared", "Your birthday has been removed.")] });
    }
    message.reply("Usage: `!birthday set MM-DD` | `!birthday view [@user]` | `!birthday clear`");
  },
};
