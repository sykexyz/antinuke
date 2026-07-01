import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "createrole",
  description: "Create a new role in this server",
  category: "roles",
  ownerOnly: true,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("createrole")
    .setDescription("Create a new role in this server")
    .addStringOption(opt => opt.setName("name").setDescription("Role name").setRequired(true))
    .addStringOption(opt => opt.setName("color").setDescription("Role color (hex, e.g. #7c4dff)").setRequired(false))
    .addBooleanOption(opt => opt.setName("hoist").setDescription("Show role separately in member list").setRequired(false)),
  async execute(interaction, client) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Manage Roles** permission.")], ephemeral: true });

    const name = interaction.options.getString("name");
    const color = interaction.options.getString("color") || "#000000";
    const hoist = interaction.options.getBoolean("hoist") ?? false;

    if (!/^#[0-9a-f]{6}$/i.test(color))
      return interaction.reply({ embeds: [errorEmbed("Invalid Color", "Provide a valid hex color (e.g. `#7c4dff`).")], ephemeral: true });

    const role = await interaction.guild.roles.create({ name, color, hoist, reason: `Created by ${interaction.user.tag}` });
    await interaction.reply({ embeds: [successEmbed("Role Created", `Created <@&${role.id}>\n**◦ Name:** ${role.name}\n**◦ Color:** \`${color}\`\n**◦ ID:** \`${role.id}\``)] });
  },
};
