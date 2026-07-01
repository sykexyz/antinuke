import { PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { query, getGuildConfig } from "../../lib/db.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "ticket",
  description: "Manage tickets",
  usage: "!ticket <open|close|claim> [category]",
  category: "tickets",
  ownerOnly: false,
  aliases: [],
  cooldown: 10,
  async execute(message, args, client, config) {
    const sub = args[0]?.toLowerCase();

    if (sub === "open" || !sub) {
      const category = args[1] || "support";
      const channel = await message.guild.channels.create({
        name: `ticket-${message.author.username}`,
        type: ChannelType.GuildText,
        topic: `Ticket by ${message.author.tag} | Category: ${category}`,
        permissionOverwrites: [
          { id: message.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
          { id: message.author.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ],
      });

      await query(
        "INSERT INTO tickets (guild_id, channel_id, user_id, category) VALUES ($1, $2, $3, $4)",
        [message.guild.id, channel.id, message.author.id, category]
      );

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("close_ticket").setLabel("Close Ticket").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("claim_ticket").setLabel("Claim Ticket").setStyle(ButtonStyle.Primary),
      );

      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle(`Ticket — ${category.toUpperCase()}`)
        .setDescription(`Hello ${message.author}! Support will be with you shortly.\n\nPlease describe your issue.`)
        .setTimestamp();

      await channel.send({ embeds: [embed], components: [closeRow] });
      await message.reply({ embeds: [successEmbed("Ticket Opened", `Your ticket was created in ${channel}.`)] });
      return;
    }

    if (sub === "close") {
      const ticket = await query("SELECT * FROM tickets WHERE channel_id = $1 AND status = 'open'", [message.channelId]);
      if (!ticket.rows.length) return message.reply({ embeds: [errorEmbed("Not a Ticket", "This is not an open ticket channel.")] });
      await query("UPDATE tickets SET status = 'closed', closed_at = NOW() WHERE channel_id = $1", [message.channelId]);
      await message.reply({ embeds: [successEmbed("Ticket Closed", "This ticket will be archived.")] });
      setTimeout(() => message.channel.delete().catch(() => {}), 5000);
    }
  },
};
