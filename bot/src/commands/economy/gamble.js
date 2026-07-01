import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "gamble",
  description: "Gamble your coins",
  usage: "!gamble <amount|all>",
  category: "economy",
  ownerOnly: false,
  aliases: ["slots", "bet"],
  cooldown: 5,
  async execute(message, args, client, config) {
    const member = await getMember(message.author.id, message.guild.id);
    let amount = args[0] === "all" ? (member.coins || 0) : parseInt(args[0]);
    if (!amount || amount <= 0 || amount > (member.coins || 0))
      return message.reply({ embeds: [errorEmbed("Invalid", `You have **${member.coins || 0}** coins. Bet a valid amount.`)] });

    const slots = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];
    const s1 = slots[Math.floor(Math.random() * slots.length)];
    const s2 = slots[Math.floor(Math.random() * slots.length)];
    const s3 = slots[Math.floor(Math.random() * slots.length)];
    const win = s1 === s2 && s2 === s3;
    const jackpot = s1 === "💎" && win;
    const winAmount = jackpot ? amount * 5 : win ? amount * 2 : -amount;

    await query("UPDATE members SET coins = coins + $1 WHERE user_id = $2 AND guild_id = $3", [winAmount, message.author.id, message.guild.id]);
    const newBal = (member.coins || 0) + winAmount;

    const embed = jackpot
      ? successEmbed("JACKPOT!", `[ ${s1} ${s2} ${s3} ]\n\nYou won **${amount * 5}** coins! Balance: **${newBal}**`)
      : win
        ? successEmbed("Winner!", `[ ${s1} ${s2} ${s3} ]\n\nYou won **${amount}** coins! Balance: **${newBal}**`)
        : errorEmbed("Lost!", `[ ${s1} ${s2} ${s3} ]\n\nYou lost **${amount}** coins. Balance: **${newBal}**`);
    await message.reply({ embeds: [embed] });
  },
};
