import { SlashCommandBuilder } from "discord.js";
import { isOwner } from "../../utils/permissions.js";
import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";

export const guildBlacklist = new Set();
export const userBlacklist = new Set();

export default {
  name: "blacklist",
  description: "Blacklist a guild or user from using the bot",
  category: "owner",
  ownerOnly: true,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a guild or user from using the bot")
    .addSubcommand(sub =>
      sub.setName("guild")
        .setDescription("Blacklist a guild")
        .addStringOption(opt => opt.setName("action").setDescription("add or remove").setRequired(true).addChoices({ name: "add", value: "add" }, { name: "remove", value: "remove" }))
        .addStringOption(opt => opt.setName("id").setDescription("Guild ID").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("user")
        .setDescription("Blacklist a user")
        .addStringOption(opt => opt.setName("action").setDescription("add or remove").setRequired(true).addChoices({ name: "add", value: "add" }, { name: "remove", value: "remove" }))
        .addUserOption(opt => opt.setName("user").setDescription("User to blacklist").setRequired(true))
    ),
  async execute(interaction, client) {
    if (!isOwner(interaction.user.id))
      return interaction.reply({ embeds: [errorEmbed("Bot Owner Only", "Only the bot owner can use this command.")], ephemeral: true });

    const sub = interaction.options.getSubcommand();
    const action = interaction.options.getString("action");

    if (sub === "guild") {
      const id = interaction.options.getString("id");
      if (action === "add") {
        guildBlacklist.add(id);
        await interaction.reply({ embeds: [successEmbed("Blacklisted", `Guild \`${id}\` blacklisted.`)] });
        const g = client.guilds.cache.get(id);
        if (g) await g.leave();
      } else {
        guildBlacklist.delete(id);
        await interaction.reply({ embeds: [successEmbed("Removed", `Guild \`${id}\` removed from blacklist.`)] });
      }
      return;
    }

    if (sub === "user") {
      const user = interaction.options.getUser("user");
      if (action === "add") {
        userBlacklist.add(user.id);
        await interaction.reply({ embeds: [successEmbed("Blacklisted", `**${user.username}** (\`${user.id}\`) blacklisted.`)] });
      } else {
        userBlacklist.delete(user.id);
        await interaction.reply({ embeds: [successEmbed("Removed", `**${user.username}** removed from blacklist.`)] });
      }
    }
  },
};
