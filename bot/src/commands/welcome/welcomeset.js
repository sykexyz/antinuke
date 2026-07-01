import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "welcomeset",
  description: "Set the welcome message and channel",
  usage: "!welcomeset <#channel> <message>",
  category: "welcome",
  ownerOnly: true,
  aliases: ["setwelcome"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ManageGuild permission.")] });

    const channel = message.mentions.channels.first();
    if (!channel) return message.reply({ embeds: [errorEmbed("No Channel", "Mention a channel for welcome messages.")] });

    const welcomeMsg = args.slice(1).join(" ") || "Welcome **{user}** to **{server}**! You are member **#{count}**.";
    await query("UPDATE guilds SET welcome_channel = $1, welcome_message = $2 WHERE id = $3", [channel.id, welcomeMsg, message.guild.id]);
    await message.reply({ embeds: [successEmbed("Welcome Set", `Welcome messages will be sent to ${channel}.\n**Message:** ${welcomeMsg}`)] });
  },
};
