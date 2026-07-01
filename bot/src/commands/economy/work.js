import { SlashCommandBuilder } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

const workMessages = [
  "You worked as a chef", "You delivered packages", "You coded all day",
  "You walked dogs", "You did freelance design", "You streamed to 3 viewers",
  "You babysat the neighbors", "You fixed computers", "You drove for a rideshare",
  "You sold handmade crafts",
];

const workCooldowns = new Map();

export default {
  name: "work",
  description: "Work to earn coins (1-hour cooldown)",
  category: "economy",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn coins (1-hour cooldown)"),
  async execute(interaction, client) {
    const key = `${interaction.user.id}-${interaction.guild.id}`;
    const last = workCooldowns.get(key) || 0;
    const now = Date.now();
    if (now - last < 3600000) {
      const remaining = Math.ceil((3600000 - (now - last)) / 60000);
      return interaction.reply({ embeds: [errorEmbed("Already Worked", `You're tired! Come back in **${remaining} minutes**.`)], ephemeral: true });
    }
    workCooldowns.set(key, now);
    const amount = Math.floor(Math.random() * 200) + 50;
    await query("UPDATE members SET coins = coins + $1 WHERE user_id = $2 AND guild_id = $3", [amount, interaction.user.id, interaction.guild.id]);
    const msg = workMessages[Math.floor(Math.random() * workMessages.length)];
    await interaction.reply({ embeds: [successEmbed("Work Complete 💼", `${msg} and earned **${amount}** 🪙!`)] });
  },
};
