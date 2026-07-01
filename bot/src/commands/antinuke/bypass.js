import { SlashCommandBuilder } from "discord.js";
import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "bypass",
  description: "Manage bypass roles for the anti-nuke system",
  category: "antinuke",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("bypass")
    .setDescription("Manage bypass roles for the anti-nuke system")
    .addSubcommand(sub => sub.setName("list").setDescription("List all bypass roles"))
    .addSubcommand(sub =>
      sub.setName("add")
        .setDescription("Add a bypass role")
        .addRoleOption(opt => opt.setName("role").setDescription("Role to add").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("remove")
        .setDescription("Remove a bypass role")
        .addRoleOption(opt => opt.setName("role").setDescription("Role to remove").setRequired(true))
    ),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId)
      return interaction.reply({ embeds: [errorEmbed("Owner Only", "Only the server owner can manage bypass roles.")], ephemeral: true });

    const sub = interaction.options.getSubcommand();
    const config = await getGuildConfig(interaction.guild.id);
    let current = config.bypass_roles || [];

    if (sub === "list") {
      const roles = current.map(id => `<@&${id}>`).join("\n") || "None configured";
      return interaction.reply({ embeds: [infoEmbed("Bypass Roles", `Roles that are exempt from anti-nuke:\n\n${roles}`)] });
    }

    const role = interaction.options.getRole("role");

    if (sub === "add") {
      if (current.includes(role.id))
        return interaction.reply({ embeds: [errorEmbed("Already Added", `${role.name} is already a bypass role.`)], ephemeral: true });
      current.push(role.id);
      await query("UPDATE guilds SET bypass_roles = $1 WHERE id = $2", [JSON.stringify(current), interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Bypass Added", `<@&${role.id}> is now exempt from anti-nuke.`)] });
    }

    if (sub === "remove") {
      current = current.filter(id => id !== role.id);
      await query("UPDATE guilds SET bypass_roles = $1 WHERE id = $2", [JSON.stringify(current), interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Bypass Removed", `<@&${role.id}> removed from bypass roles.`)] });
    }
  },
};
