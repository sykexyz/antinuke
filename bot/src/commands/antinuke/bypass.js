import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "bypass",
  description: "Manage bypass roles for the anti-nuke system",
  usage: "!bypass <add|remove|list> [@role]",
  category: "antinuke",
  ownerOnly: true,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (message.author.id !== message.guild.ownerId)
      return message.reply({ embeds: [errorEmbed("Owner Only", "Only the server owner can manage bypass roles.")] });

    const sub = args[0]?.toLowerCase();
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);

    if (sub === "list") {
      const roles = (config.bypass_roles || []).map(id => `<@&${id}>`).join(", ") || "None";
      return message.reply({ embeds: [infoEmbed("Bypass Roles", `Current bypass roles:\n${roles}`)] });
    }

    if (!role) return message.reply({ embeds: [errorEmbed("No Role", "Please mention or provide a role ID.")] });

    let current = config.bypass_roles || [];
    if (sub === "add") {
      if (current.includes(role.id)) return message.reply({ embeds: [errorEmbed("Already Added", "That role is already a bypass role.")] });
      current.push(role.id);
      await query("UPDATE guilds SET bypass_roles = $1 WHERE id = $2", [JSON.stringify(current), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Bypass Added", `${role.name} is now a bypass role.`)] });
    }

    if (sub === "remove") {
      current = current.filter(id => id !== role.id);
      await query("UPDATE guilds SET bypass_roles = $1 WHERE id = $2", [JSON.stringify(current), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Bypass Removed", `${role.name} removed from bypass roles.`)] });
    }

    return message.reply({ embeds: [errorEmbed("Invalid", "Usage: `!bypass <add|remove|list> [@role]`")] });
  },
};
