import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "note",
  description: "Add or view private mod notes on a user",
  category: "social",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageMessages")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Messages permission.")] });
    const sub = args[0]?.toLowerCase();
    const target = message.mentions.users.first();
    if (!target && sub !== "list") return message.reply("Usage: `!note add @user <note>` | `!note view @user` | `!note clear @user`");
    if (sub === "add") {
      const text = args.slice(2).join(" ");
      if (!text) return message.reply("Usage: `!note add @user <note text>`");
      const existing = await query("SELECT afk FROM members WHERE user_id = $1 AND guild_id = $2", [target.id, message.guild.id]);
      const current = existing.rows[0]?.afk ? JSON.parse(existing.rows[0].afk.startsWith("[") ? existing.rows[0].afk : "[]") : [];
      current.push({ text, by: message.author.tag, at: new Date().toISOString() });
      await query("UPDATE members SET afk = $1 WHERE user_id = $2 AND guild_id = $3", [JSON.stringify(current), target.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Note Added", `Added note for **${target.username}**:\n> ${text}`)] });
    }
    if (sub === "view") {
      const res = await query("SELECT afk FROM members WHERE user_id = $1 AND guild_id = $2", [target.id, message.guild.id]);
      const raw = res.rows[0]?.afk;
      const notes = raw?.startsWith("[") ? JSON.parse(raw) : [];
      if (!notes.length) return message.reply({ embeds: [infoEmbed(`Notes — ${target.username}`, "No notes on this user.")] });
      const list = notes.map((n, i) => `**${i+1}.** ${n.text}\n*— ${n.by} • <t:${Math.floor(new Date(n.at).getTime()/1000)}:R>*`).join("\n\n");
      return message.reply({ embeds: [infoEmbed(`Notes — ${target.username}`, list.slice(0, 2000))] });
    }
    if (sub === "clear") {
      await query("UPDATE members SET afk = NULL WHERE user_id = $1 AND guild_id = $2", [target.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Notes Cleared", `Cleared all notes for **${target.username}**.`)] });
    }
    message.reply("Usage: `!note add @user <text>` | `!note view @user` | `!note clear @user`");
  },
};
