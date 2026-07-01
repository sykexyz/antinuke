import { EmbedBuilder } from "discord.js";
import { query } from "../lib/db.js";
import { successEmbed, errorEmbed, infoEmbed } from "../utils/embed.js";

export default {
  name: "interactionCreate",
  async execute(interaction, client) {

    // Slash commands — bot uses prefix (!) commands only
    if (interaction.isChatInputCommand()) {
      const config = interaction.guild
        ? await query("SELECT prefix FROM guild_config WHERE guild_id = $1", [interaction.guild.id]).then(r => r.rows[0]).catch(() => null)
        : null;
      const prefix = config?.prefix || "!";
      return interaction.reply({
        embeds: [
          infoEmbed(
            "Use Prefix Commands",
            `This bot uses prefix commands, not slash commands.\nTry \`${prefix}${interaction.commandName}\` instead.\n\nUse \`${prefix}help\` to see all available commands.`
          )
        ],
        ephemeral: true,
      }).catch(() => {});
    }

    // Button interactions
    if (!interaction.isButton()) return;

    const { customId, guild, member, channel } = interaction;

    if (customId === "close_ticket") {
      try {
        const result = await query(
          "SELECT * FROM tickets WHERE channel_id = $1 AND status = 'open'",
          [channel.id]
        );
        if (!result.rows.length) {
          return interaction.reply({ embeds: [errorEmbed("Not a Ticket", "This is not an open ticket channel.")], ephemeral: true });
        }
        await query(
          "UPDATE tickets SET status = 'closed', closed_at = NOW() WHERE channel_id = $1",
          [channel.id]
        );
        await interaction.reply({ embeds: [successEmbed("Ticket Closed", "This ticket has been closed and will be deleted in 5 seconds.")] });
        setTimeout(() => channel.delete().catch(() => {}), 5000);
      } catch (err) {
        console.error("[TICKET] close_ticket error:", err);
        interaction.reply({ embeds: [errorEmbed("Error", "Could not close the ticket.")], ephemeral: true }).catch(() => {});
      }
      return;
    }

    if (customId === "claim_ticket") {
      try {
        const result = await query(
          "SELECT * FROM tickets WHERE channel_id = $1 AND status = 'open'",
          [channel.id]
        );
        if (!result.rows.length) {
          return interaction.reply({ embeds: [errorEmbed("Not a Ticket", "This ticket is not open.")], ephemeral: true });
        }
        const hasPerms = member.permissions.has("ManageChannels");
        if (!hasPerms) {
          return interaction.reply({ embeds: [errorEmbed("No Permission", "You need **Manage Channels** to claim tickets.")], ephemeral: true });
        }
        await query(
          "UPDATE tickets SET claimed_by = $1 WHERE channel_id = $2",
          [member.id, channel.id]
        );
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(0x00ff41)
              .setTitle("✅ Ticket Claimed")
              .setDescription(`This ticket has been claimed by ${member}.`)
              .setTimestamp()
          ]
        });
      } catch (err) {
        console.error("[TICKET] claim_ticket error:", err);
        interaction.reply({ embeds: [errorEmbed("Error", "Could not claim the ticket.")], ephemeral: true }).catch(() => {});
      }
      return;
    }
  },
};
