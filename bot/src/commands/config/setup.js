import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { query } from "../../lib/db.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "setup",
  description: "Configure bot settings for this server",
  usage: "!setup <setting> <value>",
  category: "config",
  ownerOnly: true,
  aliases: ["config", "set"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (message.author.id !== message.guild.ownerId && !message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.reply({ embeds: [errorEmbed("No Permission", "Only the server owner or admins can use setup.")] });

    const setting = args[0]?.toLowerCase();
    const value = args.slice(1).join(" ");

    const settingMap = {
      "logchannel": { col: "log_channel", extract: () => message.mentions.channels.first()?.id || args[1] },
      "modlog": { col: "mod_log_channel", extract: () => message.mentions.channels.first()?.id || args[1] },
      "welcome": { col: "welcome_channel", extract: () => message.mentions.channels.first()?.id || args[1] },
      "leave": { col: "leave_channel", extract: () => message.mentions.channels.first()?.id || args[1] },
      "prefix": { col: "prefix", extract: () => args[1] },
      "welcomemsg": { col: "welcome_message", extract: () => value },
      "leavemsg": { col: "leave_message", extract: () => value },
      "joinrole": { col: "join_role", extract: () => message.mentions.roles.first()?.id || args[1] },
      "levelchannel": { col: "level_up_channel", extract: () => message.mentions.channels.first()?.id || args[1] },
    };

    if (!setting || !settingMap[setting]) {
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Setup Options")
        .setDescription(Object.keys(settingMap).map(k => `\`!setup ${k}\``).join("\n"))
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    const { col, extract } = settingMap[setting];
    const val = extract();
    if (!val) return message.reply({ embeds: [errorEmbed("Invalid Value", "Provide a valid value for this setting.")] });

    await query(`UPDATE guilds SET ${col} = $1 WHERE id = $2`, [val, message.guild.id]);
    await message.reply({ embeds: [successEmbed("Updated", `**${setting}** has been set to \`${val}\`.`)] });
  },
};
