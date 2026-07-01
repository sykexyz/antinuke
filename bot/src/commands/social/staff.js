import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "staff",
  description: "Lists all staff members (moderators and admins) in the server",
  category: "social",
  prefix: true,
  cooldown: 10,
  async execute(message) {
    await message.guild.members.fetch();
    const staff = message.guild.members.cache.filter(m =>
      !m.user.bot && (
        m.permissions.has("BanMembers") ||
        m.permissions.has("KickMembers") ||
        m.permissions.has("ManageMessages") ||
        m.id === message.guild.ownerId
      )
    );
    const owner = staff.filter(m => m.id === message.guild.ownerId);
    const admins = staff.filter(m => m.permissions.has("Administrator") && m.id !== message.guild.ownerId);
    const mods = staff.filter(m => !m.permissions.has("Administrator") && m.id !== message.guild.ownerId);
    let desc = "";
    if (owner.size) desc += `**👑 Owner**\n${owner.map(m=>`<@${m.id}>`).join("\n")}\n\n`;
    if (admins.size) desc += `**🛡️ Admins (${admins.size})**\n${admins.map(m=>`<@${m.id}>`).join("\n")}\n\n`;
    if (mods.size) desc += `**🔨 Moderators (${mods.size})**\n${mods.map(m=>`<@${m.id}>`).join("\n")}`;
    message.reply({ embeds: [infoEmbed(`Staff — ${message.guild.name}`, desc || "No staff found.")] });
  },
};
