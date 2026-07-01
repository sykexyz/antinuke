import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { query } from "../../lib/db.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "setup",
  description: "Configure bot settings for this server",
  category: "config",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure bot settings for this server")
    .addSubcommand(sub =>
      sub.setName("logchannel").setDescription("Set the log channel")
        .addChannelOption(opt => opt.setName("channel").setDescription("Log channel").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("modlog").setDescription("Set the mod-log channel")
        .addChannelOption(opt => opt.setName("channel").setDescription("Mod log channel").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("welcome").setDescription("Set the welcome channel")
        .addChannelOption(opt => opt.setName("channel").setDescription("Welcome channel").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("leave").setDescription("Set the leave channel")
        .addChannelOption(opt => opt.setName("channel").setDescription("Leave channel").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("levelchannel").setDescription("Set the level-up announcement channel")
        .addChannelOption(opt => opt.setName("channel").setDescription("Level up channel").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("joinrole").setDescription("Set the auto-role for new members")
        .addRoleOption(opt => opt.setName("role").setDescription("Role to assign on join").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("welcomemsg").setDescription("Set a custom welcome message (use {user} and {server})")
        .addStringOption(opt => opt.setName("message").setDescription("Welcome message text").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("leavemsg").setDescription("Set a custom leave message (use {user} and {server})")
        .addStringOption(opt => opt.setName("message").setDescription("Leave message text").setRequired(true))
    ),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId && !interaction.member.permissions.has(PermissionFlagsBits.Administrator))
      return interaction.reply({ embeds: [errorEmbed("No Permission", "Only the server owner or admins can use setup.")], ephemeral: true });

    const sub = interaction.options.getSubcommand();

    const channelSubs = { logchannel: "log_channel", modlog: "mod_log_channel", welcome: "welcome_channel", leave: "leave_channel", levelchannel: "level_up_channel" };
    if (channelSubs[sub]) {
      const ch = interaction.options.getChannel("channel");
      await query(`UPDATE guilds SET ${channelSubs[sub]} = $1 WHERE id = $2`, [ch.id, interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Updated", `**${sub}** set to ${ch}.`)] });
    }

    if (sub === "joinrole") {
      const role = interaction.options.getRole("role");
      await query("UPDATE guilds SET join_role = $1 WHERE id = $2", [role.id, interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Updated", `Join role set to <@&${role.id}>.`)] });
    }

    if (sub === "welcomemsg") {
      const msg = interaction.options.getString("message");
      await query("UPDATE guilds SET welcome_message = $1 WHERE id = $2", [msg, interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Updated", `Welcome message set to:\n> ${msg}`)] });
    }

    if (sub === "leavemsg") {
      const msg = interaction.options.getString("message");
      await query("UPDATE guilds SET leave_message = $1 WHERE id = $2", [msg, interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Updated", `Leave message set to:\n> ${msg}`)] });
    }
  },
};
