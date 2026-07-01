import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "permcheck",
  description: "Checks what permissions a user has in this server",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const target = message.mentions.members.first() || message.member;
    const perms = target.permissions.toArray();
    const nice = perms.map(p => `✅ \`${p}\``).join("\n") || "No permissions";
    const embed = infoEmbed(`Permissions — ${target.user.username}`, nice.slice(0, 4000));
    message.reply({ embeds: [embed] });
  },
};
