import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getMember, updateMember, query } from "../../lib/db.js";

export default {
  name: "daily",
  description: "Claim your daily coins",
  usage: "!daily",
  category: "economy",
  ownerOnly: false,
  aliases: [],
  cooldown: 3,
  async execute(message, args, client, config) {
    const member = await getMember(message.author.id, message.guild.id);
    const last = member.last_daily ? new Date(member.last_daily).getTime() : 0;
    const now = Date.now();
    if (now - last < 86400000) {
      const remaining = Math.ceil((86400000 - (now - last)) / 3600000);
      return message.reply({ embeds: [errorEmbed("Daily Claimed", `You already claimed your daily! Come back in **${remaining}h**.`)] });
    }
    const amount = Math.floor(Math.random() * 200) + 100;
    await query("UPDATE members SET coins = coins + $1, last_daily = NOW() WHERE user_id = $2 AND guild_id = $3", [amount, message.author.id, message.guild.id]);
    await message.reply({ embeds: [successEmbed("Daily Reward", `You claimed **${amount}** coins! Come back tomorrow.`)] });
  },
};
