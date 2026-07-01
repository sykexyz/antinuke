import { infoEmbed, successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "threads",
  description: "Manage threads — list, archive, or unarchive",
  category: "server",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageThreads")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Threads permission.")] });
    const sub = args[0]?.toLowerCase() || "list";
    if (sub === "list") {
      const active = await message.guild.channels.fetchActiveThreads();
      const list = active.threads.map(t => `<#${t.id}> — ${t.memberCount || 0} members`).slice(0,20).join("\n") || "No active threads.";
      return message.reply({ embeds: [infoEmbed(`Active Threads (${active.threads.size})`, list)] });
    }
    if (sub === "archive") {
      const thread = message.mentions.channels.first();
      if (!thread?.isThread()) return message.reply("Usage: `!threads archive #thread`");
      await thread.setArchived(true);
      return message.reply({ embeds: [successEmbed("Archived", `Thread <#${thread.id}> has been archived.`)] });
    }
    if (sub === "unarchive") {
      const thread = message.mentions.channels.first();
      if (!thread?.isThread()) return message.reply("Usage: `!threads unarchive #thread`");
      await thread.setArchived(false);
      return message.reply({ embeds: [successEmbed("Unarchived", `Thread <#${thread.id}> has been unarchived.`)] });
    }
    message.reply("Usage: `!threads list` | `!threads archive #thread` | `!threads unarchive #thread`");
  },
};
