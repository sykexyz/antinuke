import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "antinuke",
  description: "Configure the anti-nuke system",
  usage: "!antinuke <enable|disable|config|status>",
  category: "antinuke",
  ownerOnly: true,
  aliases: ["an"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (message.author.id !== message.guild.ownerId)
      return message.reply({ embeds: [errorEmbed("Owner Only", "Only the server owner can configure anti-nuke.")] });

    const sub = args[0]?.toLowerCase();

    if (sub === "enable") {
      await query("UPDATE guilds SET anti_nuke_enabled = true WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Anti-Nuke Enabled", "The anti-nuke system is now active.")] });
    }

    if (sub === "disable") {
      await query("UPDATE guilds SET anti_nuke_enabled = false WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [errorEmbed("Anti-Nuke Disabled", "Warning: Your server is now unprotected.")] });
    }

    if (sub === "status" || !sub) {
      const embed = new EmbedBuilder()
        .setColor(config.anti_nuke_enabled ? 0x00ff41 : 0xff3333)
        .setTitle("Anti-Nuke Status")
        .addFields(
          { name: "Status", value: config.anti_nuke_enabled ? "✅ Active" : "❌ Disabled", inline: true },
          { name: "Threshold", value: `${config.anti_nuke_threshold || 5} actions`, inline: true },
          { name: "Window", value: `${config.anti_nuke_window || 10}s`, inline: true },
          { name: "Anti-Raid", value: config.anti_raid_enabled ? "✅ Active" : "❌ Disabled", inline: true },
          { name: "Bypass Roles", value: (config.bypass_roles || []).length.toString(), inline: true },
          { name: "Trusted Bots", value: (config.trusted_bots || []).length.toString(), inline: true },
        )
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    if (sub === "threshold") {
      const val = parseInt(args[1]);
      if (isNaN(val) || val < 1) return message.reply({ embeds: [errorEmbed("Invalid", "Threshold must be a positive number.")] });
      await query("UPDATE guilds SET anti_nuke_threshold = $1 WHERE id = $2", [val, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Threshold Updated", `Anti-nuke threshold set to **${val}** actions.`)] });
    }

    return message.reply({ embeds: [infoEmbed("Anti-Nuke Help", "Subcommands: `enable`, `disable`, `status`, `threshold <number>`")] });
  },
};
