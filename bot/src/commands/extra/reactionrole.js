import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "reactionrole",
  description: "Set up reaction roles — click emoji to get a role",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Roles permission.")] });
    const sub = args[0]?.toLowerCase();
    if (!sub || sub === "list") {
      const res = await query("SELECT reaction_roles FROM guilds WHERE id = $1", [message.guild.id]);
      const rr = res.rows[0]?.reaction_roles || [];
      if (!rr.length) return message.reply({ embeds: [infoEmbed("Reaction Roles", "No reaction roles configured.")] });
      const list = rr.map(r => `**${r.emoji}** → <@&${r.roleId}> in [jump](${r.messageUrl || "#"})`).join("\n");
      return message.reply({ embeds: [infoEmbed(`Reaction Roles (${rr.length})`, list)] });
    }
    if (sub === "add") {
      if (args.length < 3) return message.reply("Usage: `!reactionrole add <messageId> <emoji> @role`");
      const msgId = args[1], emoji = args[2];
      const role = message.mentions.roles.first();
      if (!role) return message.reply({ embeds: [errorEmbed("Missing Role", "Mention a role.")] });
      let msg;
      try { msg = await message.channel.messages.fetch(msgId); } catch { return message.reply({ embeds: [errorEmbed("Not Found", "Message not found in this channel.")] }); }
      await msg.react(emoji).catch(() => {});
      const res = await query("SELECT reaction_roles FROM guilds WHERE id = $1", [message.guild.id]);
      const rr = res.rows[0]?.reaction_roles || [];
      rr.push({ messageId: msgId, channelId: message.channel.id, emoji, roleId: role.id, messageUrl: msg.url });
      await query("UPDATE guilds SET reaction_roles = $1::jsonb WHERE id = $2", [JSON.stringify(rr), message.guild.id]);
      return message.reply({ embeds: [successEmbed("Reaction Role Added", `React with **${emoji}** on that message to get **${role.name}**.`)] });
    }
    if (sub === "clear") {
      await query("UPDATE guilds SET reaction_roles = '[]'::jsonb WHERE id = $1", [message.guild.id]);
      return message.reply({ embeds: [successEmbed("Cleared", "All reaction roles have been removed.")] });
    }
    message.reply("Usage: `!reactionrole list` | `!reactionrole add <msgId> <emoji> @role` | `!reactionrole clear`");
  },
};
