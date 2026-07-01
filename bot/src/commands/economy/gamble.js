import { SlashCommandBuilder } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "gamble",
  description: "Gamble your coins on the slot machine",
  category: "economy",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Gamble your coins on the slot machine")
    .addStringOption(opt => opt.setName("amount").setDescription('Amount to bet or "all"').setRequired(true)),
  async execute(interaction, client) {
    const member = await getMember(interaction.user.id, interaction.guild.id);
    const raw = interaction.options.getString("amount");
    let amount = raw === "all" ? (member.coins || 0) : parseInt(raw);
    if (!amount || amount <= 0 || amount > (member.coins || 0))
      return interaction.reply({ embeds: [errorEmbed("Invalid Bet", `You have **${member.coins || 0}** 🪙. Bet a valid amount.`)], ephemeral: true });

    const slots = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎"];
    const s1 = slots[Math.floor(Math.random() * slots.length)];
    const s2 = slots[Math.floor(Math.random() * slots.length)];
    const s3 = slots[Math.floor(Math.random() * slots.length)];
    const win = s1 === s2 && s2 === s3;
    const jackpot = s1 === "💎" && win;
    const winAmount = jackpot ? amount * 5 : win ? amount * 2 : -amount;

    await query("UPDATE members SET coins = coins + $1 WHERE user_id = $2 AND guild_id = $3", [winAmount, interaction.user.id, interaction.guild.id]);
    const newBal = (member.coins || 0) + winAmount;
    const slotDisplay = `\`[ ${s1}  ${s2}  ${s3} ]\``;

    const embed = jackpot
      ? successEmbed("💎 JACKPOT!", `${slotDisplay}\n\n**◦ Won** — \`${amount * 5}\` 🪙\n**◦ Balance** — \`${newBal}\` 🪙`)
      : win
        ? successEmbed("🎉 Winner!", `${slotDisplay}\n\n**◦ Won** — \`${amount}\` 🪙\n**◦ Balance** — \`${newBal}\` 🪙`)
        : errorEmbed("💸 Lost!", `${slotDisplay}\n\n**◦ Lost** — \`${amount}\` 🪙\n**◦ Balance** — \`${newBal}\` 🪙`);
    await interaction.reply({ embeds: [embed] });
  },
};
