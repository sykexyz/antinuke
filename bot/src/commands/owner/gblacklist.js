import { isOwner } from "../../utils/permissions.js";
import { query } from "../../lib/db.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

const guildBlacklist = new Set();
const userBlacklist = new Set();

export { guildBlacklist, userBlacklist };

export default {
  name: "blacklist",
  description: "Blacklist a guild or user from using the bot",
  usage: "!blacklist <guild|user> <add|remove> <id>",
  category: "owner",
  ownerOnly: true,
  aliases: [],
  cooldown: 3,
  async execute(message, args, client, config) {
    if (!isOwner(message.author.id))
      return message.reply({ embeds: [errorEmbed("Bot Owner Only", "Only the bot owner can use this command.")] });

    const type = args[0]?.toLowerCase();
    const action = args[1]?.toLowerCase();
    const id = args[2];

    if (!type || !action || !id)
      return message.reply({ embeds: [errorEmbed("Usage", "!blacklist <guild|user> <add|remove> <id>")] });

    if (type === "guild") {
      if (action === "add") {
        guildBlacklist.add(id);
        await message.reply({ embeds: [successEmbed("Blacklisted", `Guild \`${id}\` blacklisted.`)] });
        const g = client.guilds.cache.get(id);
        if (g) await g.leave();
      } else {
        guildBlacklist.delete(id);
        await message.reply({ embeds: [successEmbed("Removed", `Guild \`${id}\` removed from blacklist.`)] });
      }
    } else if (type === "user") {
      if (action === "add") {
        userBlacklist.add(id);
        await message.reply({ embeds: [successEmbed("Blacklisted", `User \`${id}\` blacklisted.`)] });
      } else {
        userBlacklist.delete(id);
        await message.reply({ embeds: [successEmbed("Removed", `User \`${id}\` removed from blacklist.`)] });
      }
    }
  },
};
