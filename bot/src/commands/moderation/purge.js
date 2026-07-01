import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "purge",
  description: "Delete messages from the channel",
  category: "moderation",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete messages from the channel")
    .addIntegerOption(opt => opt.setName("amount").setDescription("Number of messages to delete (1–100)").setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(opt => opt.setName("user").setDescription("Only delete messages from this user").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Manage Messages** permission.")], ephemeral: true });

    const amount = interaction.options.getInteger("amount");
    const filterUser = interaction.options.getUser("user");

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: 100 });
    if (filterUser) messages = messages.filter(m => m.author.id === filterUser.id);
    messages = [...messages.values()].slice(0, amount);

    const deleted = await interaction.channel.bulkDelete(messages, true).catch(() => null);
    const count = deleted?.size || 0;
    await interaction.editReply({ embeds: [successEmbed("Purged", `Deleted **${count}** messages${filterUser ? ` from **${filterUser.username}**` : ""}.`)] });
  },
};
