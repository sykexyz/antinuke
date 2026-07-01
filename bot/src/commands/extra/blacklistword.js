import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "blacklistword",
  description: "Manage the server word blacklist",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const sub = args[0]?.toLowerCase();
    const config = await getGuildConfig(message.guild.id);
    const list = Array.isArray(config.word_filter) ? config.word_filter : [];
    if (sub === "list" || !sub) {
      return message.reply({ embeds: [infoEmbed("Word Blacklist", list.length ? list.map(w => `\`${w}\``).join(", ") : "No words blacklisted.")] });
    }
    if (sub === "add") {
      const word = args[1]?.toLowerCase();
      if (!word) return message.reply("Usage: `!blacklistword add <word>`");
      if (list.includes(word)) return message.reply({ embeds: [errorEmbed("Already Listed", `\`${word}\` is already blacklisted.`)] });
      list.push(word);
      await query("UPDATE guilds SET word_filter = $1::jsonb WHERE id = $2", [JSON.stringify(list), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Word Added", `\`${word}\` has been blacklisted.`)] });
    }
    if (sub === "remove") {
      const word = args[1]?.toLowerCase();
      if (!word || !list.includes(word)) return message.reply({ embeds: [errorEmbed("Not Found", `\`${word}\` is not in the blacklist.`)] });
      const updated = list.filter(w => w !== word);
      await query("UPDATE guilds SET word_filter = $1::jsonb WHERE id = $2", [JSON.stringify(updated), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Word Removed", `\`${word}\` has been removed from the blacklist.`)] });
    }
    if (sub === "clear") {
      await query("UPDATE guilds SET word_filter = '[]'::jsonb WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Blacklist Cleared", "All words have been removed.")] });
    }
    message.reply("Usage: `!blacklistword list` | `!blacklistword add <word>` | `!blacklistword remove <word>` | `!blacklistword clear`");
  },
};
