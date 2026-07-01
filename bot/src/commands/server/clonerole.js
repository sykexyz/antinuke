import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "clonerole",
  description: "Duplicates a role with the same permissions and color",
  category: "server",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageRoles")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Roles permission.")] });
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(" ").toLowerCase());
    if (!role) return message.reply("Usage: `!clonerole @role` or `!clonerole role name`");
    try {
      const clone = await message.guild.roles.create({
        name: `${role.name}-clone`,
        color: role.color,
        permissions: role.permissions,
        hoist: role.hoist,
        mentionable: role.mentionable,
      });
      message.reply({ embeds: [successEmbed("Role Cloned", `**${role.name}** → **${clone.name}** (${clone.id})`)] });
    } catch (e) {
      message.reply({ embeds: [errorEmbed("Failed", e.message)] });
    }
  },
};
