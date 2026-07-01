import { SlashCommandBuilder } from "discord.js";
import { successEmbed } from "../../utils/embed.js";
import { updateMember } from "../../lib/db.js";

export default {
  name: "afk",
  description: "Set an AFK status that auto-clears when you message",
  category: "utility",
  ownerOnly: false,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Set an AFK status that auto-clears when you message")
    .addStringOption(opt => opt.setName("reason").setDescription("AFK reason").setRequired(false)),
  async execute(interaction, client) {
    const reason = interaction.options.getString("reason") || "AFK";
    await updateMember(interaction.user.id, interaction.guild.id, { afk: reason });
    await interaction.reply({ embeds: [successEmbed("AFK Set", `You are now AFK: **${reason}**`)] });
  },
};
