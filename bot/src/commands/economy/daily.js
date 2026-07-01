import { SlashCommandBuilder } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "daily",
  description: "Claim your daily coins",
  category: "economy",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins"),
  async execute(interaction, client) {
    const member = await getMember(interaction.user.id, interaction.guild.id);
    const last = member.last_daily ? new Date(member.last_daily).getTime() : 0;
    const now = Date.now();
    if (now - last < 86400000) {
      const remaining = Math.ceil((86400000 - (now - last)) / 3600000);
      return interaction.reply({ embeds: [errorEmbed("Already Claimed", `You already claimed your daily! Come back in **${remaining}h**.`)], ephemeral: true });
    }
    const amount = Math.floor(Math.random() * 200) + 100;
    await query("UPDATE members SET coins = coins + $1, last_daily = NOW() WHERE user_id = $2 AND guild_id = $3", [amount, interaction.user.id, interaction.guild.id]);
    await interaction.reply({ embeds: [successEmbed("Daily Reward 🎁", `You claimed **${amount}** coins! Come back tomorrow.`)] });
  },
};
