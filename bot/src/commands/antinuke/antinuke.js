import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { successEmbed, errorEmbed, infoEmbed, COLORS } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "antinuke",
  description: "Configure the anti-nuke protection system",
  category: "antinuke",
  ownerOnly: true,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("antinuke")
    .setDescription("Configure the anti-nuke protection system")
    .addSubcommand(sub => sub.setName("enable").setDescription("Enable anti-nuke protection"))
    .addSubcommand(sub => sub.setName("disable").setDescription("Disable anti-nuke protection"))
    .addSubcommand(sub => sub.setName("status").setDescription("View current anti-nuke settings"))
    .addSubcommand(sub =>
      sub.setName("threshold")
        .setDescription("Set the action threshold before triggering")
        .addIntegerOption(opt => opt.setName("amount").setDescription("Number of actions before trigger").setRequired(true).setMinValue(1).setMaxValue(50))
    ),
  async execute(interaction, client) {
    if (interaction.user.id !== interaction.guild.ownerId)
      return interaction.reply({ embeds: [errorEmbed("Owner Only", "Only the server owner can configure anti-nuke.")], ephemeral: true });

    const sub = interaction.options.getSubcommand();
    const config = await getGuildConfig(interaction.guild.id);

    if (sub === "enable") {
      await query("UPDATE guilds SET anti_nuke_enabled = true WHERE id = $1", [interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Anti-Nuke Enabled", "⚡ Anti-nuke protection is now **active**. Your server is protected.")] });
    }

    if (sub === "disable") {
      await query("UPDATE guilds SET anti_nuke_enabled = false WHERE id = $1", [interaction.guild.id]);
      return interaction.reply({ embeds: [errorEmbed("Anti-Nuke Disabled", "⚠️ Anti-nuke is now **disabled**. Your server is unprotected.")] });
    }

    if (sub === "status") {
      const embed = new EmbedBuilder()
        .setColor(config.anti_nuke_enabled ? COLORS.success : COLORS.error)
        .setAuthor({ name: `⚡  Anti-Nuke Status — ${interaction.guild.name}` })
        .addFields(
          { name: "Protection", value: config.anti_nuke_enabled ? "✅ Active" : "❌ Disabled", inline: true },
          { name: "Threshold", value: `${config.anti_nuke_threshold || 5} actions`, inline: true },
          { name: "Window", value: `${config.anti_nuke_window || 10}s`, inline: true },
          { name: "Anti-Raid", value: config.anti_raid_enabled ? "✅ Active" : "❌ Disabled", inline: true },
          { name: "Bypass Roles", value: (config.bypass_roles || []).length.toString(), inline: true },
          { name: "Trusted Bots", value: (config.trusted_bots || []).length.toString(), inline: true },
        )
        .setFooter({ text: "SENTRIX  •  Security System" })
        .setTimestamp();
      return interaction.reply({ embeds: [embed] });
    }

    if (sub === "threshold") {
      const val = interaction.options.getInteger("amount");
      await query("UPDATE guilds SET anti_nuke_threshold = $1 WHERE id = $2", [val, interaction.guild.id]);
      return interaction.reply({ embeds: [successEmbed("Threshold Updated", `Anti-nuke threshold set to **${val}** actions.`)] });
    }
  },
};
