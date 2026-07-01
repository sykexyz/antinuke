import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

const repCooldowns = new Map();
const REP_COOLDOWN = 24 * 60 * 60 * 1000;

export default {
  name: "rep",
  description: "Give +rep to another user (once per 24h)",
  category: "social",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length || args[0] === "check") {
      const target = message.mentions.users.first() || message.author;
      const member = await getMember(target.id, message.guild.id);
      return message.reply({ embeds: [infoEmbed(`⭐ Rep — ${target.username}`, `**Reputation:** ${member.rep || 0} points`)] });
    }
    const target = message.mentions.users.first();
    if (!target) return message.reply("Usage: `!rep @user` to give rep | `!rep check [@user]` to check");
    if (target.id === message.author.id) return message.reply({ embeds: [errorEmbed("Nope", "You can't rep yourself.")] });
    if (target.bot) return message.reply({ embeds: [errorEmbed("Nope", "Bots don't need rep.")] });
    const key = `${message.author.id}-${message.guild.id}`;
    const last = repCooldowns.get(key) || 0;
    if (Date.now() - last < REP_COOLDOWN) {
      const left = Math.ceil((REP_COOLDOWN - (Date.now()-last)) / 3600000);
      return message.reply({ embeds: [errorEmbed("Cooldown", `You can give rep again in **${left}h**.`)] });
    }
    repCooldowns.set(key, Date.now());
    await query("UPDATE members SET rep = COALESCE(rep, 0) + 1 WHERE user_id = $1 AND guild_id = $2", [target.id, message.guild.id]);
    const member = await getMember(target.id, message.guild.id);
    message.reply({ embeds: [successEmbed("⭐ Rep Given!", `You gave **+1 rep** to **${target.username}**!\nThey now have **${(member.rep||0)+1}** rep.`)] });
  },
};
