import { getGuildConfig } from "../lib/db.js";
import { errorEmbed } from "../utils/embed.js";
import { query } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction, client) {

    // ── Slash Commands ──────────────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      // Owner-only check
      if (command.ownerOnly && interaction.user.id !== interaction.guild?.ownerId) {
        return interaction.reply({
          embeds: [errorEmbed("Owner Only", "Only the server owner can use this command.")],
          ephemeral: true,
        }).catch(() => {});
      }

      // Cooldown check
      if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Map());
      const timestamps = client.cooldowns.get(command.name);
      const cooldown = (command.cooldown || 3) * 1000;
      const now = Date.now();
      if (timestamps.has(interaction.user.id)) {
        const expiry = timestamps.get(interaction.user.id) + cooldown;
        if (now < expiry) {
          const remaining = ((expiry - now) / 1000).toFixed(1);
          return interaction.reply({
            embeds: [errorEmbed("Cooldown", `Wait **${remaining}s** before using **/${command.name}** again.`)],
            ephemeral: true,
          }).catch(() => {});
        }
      }
      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldown);

      try {
        await command.execute(interaction, client);
      } catch (err) {
        console.error(`[CMD] Error in /${command.name}:`, err);
        const errEmbed = errorEmbed("Error", "Something went wrong. Please try again.");
        if (interaction.replied || interaction.deferred) {
          interaction.followUp({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
        } else {
          interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => {});
        }
      }
      return;
    }

    // ── Button Interactions ─────────────────────────────────────────────────
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
        const { successEmbed } = await import("../utils/embed.js");
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
              .setColor(0x00e676)
              .setAuthor({ name: "✦  Ticket Claimed" })
              .setDescription(`This ticket has been claimed by ${member}.`)
              .setFooter({ text: "SENTRIX" })
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
