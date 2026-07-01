import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "lockdown",
  description: "Lock or unlock all text channels (emergency lockdown)",
  category: "moderation",
  ownerOnly: true,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("lockdown")
    .setDescription("Lock or unlock all text channels")
    .addBooleanOption(opt => opt.setName("unlock").setDescription("Set to true to lift the lockdown").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Manage Channels** permission.")], ephemeral: true });

    const unlock = interaction.options.getBoolean("unlock") ?? false;
    await interaction.deferReply();
    let count = 0;
    for (const [, channel] of interaction.guild.channels.cache) {
      if (channel.isTextBased()) {
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: unlock ? null : false }).catch(() => {});
        count++;
      }
    }
    await interaction.editReply({ embeds: [successEmbed(unlock ? "Lockdown Lifted" : "Lockdown Activated", `${unlock ? "Unlocked" : "Locked"} **${count}** channels.`)] });
  },
};
