import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "setrole",
  description: "Set the admin role that can use staff commands",
  category: "config",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("setrole")
    .setDescription("Set the admin role that can use staff commands")
    .addSubcommand(sub =>
      sub.setName("set")
        .setDescription("Set a role as the admin/staff role")
        .addRoleOption(opt => opt.setName("role").setDescription("Role to give admin access").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("remove")
        .setDescription("Remove the configured admin role")
    )
    .addSubcommand(sub =>
      sub.setName("view")
        .setDescription("See the current admin role")
    ),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId)
      return interaction.reply({ embeds: [errorEmbed("Owner Only", "Only the server owner can configure the admin role.")], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    if (sub === "set") {
      const role = interaction.options.getRole("role");
      await query("UPDATE guilds SET admin_role = $1 WHERE id = $2", [role.id, interaction.guild.id]);
      return interaction.reply({
        embeds: [successEmbed("Admin Role Set", `Members with <@&${role.id}> can now use all staff commands.\n\n**◦ Role:** ${role.name}\n**◦ ID:** \`${role.id}\``)]
      });
    }

    if (sub === "remove") {
      await query("UPDATE guilds SET admin_role = NULL WHERE id = $1", [interaction.guild.id]);
      return interaction.reply({
        embeds: [successEmbed("Admin Role Removed", "No admin role is configured. Only the server owner can use staff commands.")]
      });
    }

    if (sub === "view") {
      const res = await query("SELECT admin_role FROM guilds WHERE id = $1", [interaction.guild.id]);
      const adminRole = res.rows[0]?.admin_role;
      return interaction.reply({
        embeds: [infoEmbed("Admin Role", adminRole
          ? `Current admin role: <@&${adminRole}>`
          : "No admin role configured. Use `/setrole set @role` to set one.")]
      });
    }
  },
};
