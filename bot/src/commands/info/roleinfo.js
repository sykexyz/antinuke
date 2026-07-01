import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "roleinfo",
  description: "Shows details about a role",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(" ").toLowerCase());
    if (!role) return message.reply({ embeds: [errorEmbed("Not Found", "Mention a role or provide a role name.")] });
    const embed = infoEmbed(`Role — ${role.name}`,
      `**ID:** \`${role.id}\`\n**Color:** \`${role.hexColor}\`\n**Members:** ${role.members.size}\n**Hoisted:** ${role.hoist ? "Yes" : "No"}\n**Mentionable:** ${role.mentionable ? "Yes" : "No"}\n**Position:** ${role.position}\n**Created:** <t:${Math.floor(role.createdTimestamp/1000)}:R>`
    ).setColor(role.color || 0x2b2d31);
    message.reply({ embeds: [embed] });
  },
};
