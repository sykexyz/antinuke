import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { query } from "../../lib/db.js";
import { successEmbed, errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "ticket",
  description: "Open or manage a support ticket",
  category: "tickets",
  ownerOnly: false,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Open or manage a support ticket")
    .addSubcommand(sub =>
      sub.setName("open")
        .setDescription("Open a new support ticket")
        .addStringOption(opt =>
          opt.setName("category")
            .setDescription("Ticket category")
            .setRequired(false)
            .addChoices(
              { name: "Support", value: "support" },
              { name: "Report", value: "report" },
              { name: "Appeal", value: "appeal" },
              { name: "Other", value: "other" },
            )
        )
    )
    .addSubcommand(sub => sub.setName("close").setDescription("Close the current ticket channel")),
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    if (sub === "open") {
      const category = interaction.options.getString("category") || "support";

      const existing = await query(
        "SELECT * FROM tickets WHERE guild_id = $1 AND user_id = $2 AND status = 'open'",
        [interaction.guild.id, interaction.user.id]
      );
      if (existing.rows.length)
        return interaction.reply({ embeds: [errorEmbed("Already Open", "You already have an open ticket.")], ephemeral: true });

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: ChannelType.GuildText,
        topic: `Ticket by ${interaction.user.tag} | Category: ${category}`,
        permissionOverwrites: [
          { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
          { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
        ],
      });

      await query(
        "INSERT INTO tickets (guild_id, channel_id, user_id, category) VALUES ($1, $2, $3, $4)",
        [interaction.guild.id, channel.id, interaction.user.id, category]
      );

      const closeRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("close_ticket").setLabel("Close Ticket").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("claim_ticket").setLabel("Claim Ticket").setStyle(ButtonStyle.Primary),
      );

      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setAuthor({ name: `◆  Ticket — ${category.toUpperCase()}` })
        .setDescription(`Hello ${interaction.user}! Support will be with you shortly.\n\nPlease describe your issue in detail.`)
        .setFooter({ text: "SENTRIX  •  Ticket System" })
        .setTimestamp();

      await channel.send({ embeds: [embed], components: [closeRow] });
      await interaction.reply({ embeds: [successEmbed("Ticket Opened", `Your ticket was created in ${channel}.`)], ephemeral: true });
      return;
    }

    if (sub === "close") {
      const ticket = await query("SELECT * FROM tickets WHERE channel_id = $1 AND status = 'open'", [interaction.channelId]);
      if (!ticket.rows.length) return interaction.reply({ embeds: [errorEmbed("Not a Ticket", "This is not an open ticket channel.")], ephemeral: true });
      await query("UPDATE tickets SET status = 'closed', closed_at = NOW() WHERE channel_id = $1", [interaction.channelId]);
      await interaction.reply({ embeds: [successEmbed("Ticket Closed", "This ticket will be deleted in 5 seconds.")] });
      setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
    }
  },
};
