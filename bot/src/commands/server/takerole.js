import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "takerole",
  description: "Removes a role from every member in the server",
  category: "server",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Roles permission.")] });
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Usage: `!takerole @role`");
    await message.guild.members.fetch();
    const targets = message.guild.members.cache.filter(m => m.roles.cache.has(role.id));
    const statusMsg = await message.reply(`⏳ Removing **${role.name}** from ${targets.size} members...`);
    let done = 0, failed = 0;
    for (const [, member] of targets) {
      try { await member.roles.remove(role); done++; } catch { failed++; }
      await new Promise(r => setTimeout(r, 300));
    }
    statusMsg.edit({ embeds: [successEmbed("Mass Role Remove", `✅ Removed **${role.name}** from **${done}** members.\n❌ Failed: ${failed}`)], content: null });
  },
};
