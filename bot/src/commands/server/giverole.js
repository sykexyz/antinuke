import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "giverole",
  description: "Gives a role to every human member in the server",
  category: "server",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Roles permission.")] });
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Usage: `!giverole @role`");
    await message.guild.members.fetch();
    const targets = message.guild.members.cache.filter(m => !m.user.bot && !m.roles.cache.has(role.id));
    const statusMsg = await message.reply(`⏳ Adding **${role.name}** to ${targets.size} members...`);
    let done = 0, failed = 0;
    for (const [, member] of targets) {
      try { await member.roles.add(role); done++; } catch { failed++; }
      await new Promise(r => setTimeout(r, 300));
    }
    statusMsg.edit({ embeds: [successEmbed("Mass Role Assign", `✅ Added **${role.name}** to **${done}** members.\n❌ Failed: ${failed}`)], content: null });
  },
};
