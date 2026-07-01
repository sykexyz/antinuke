import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "accountage",
  description: "Shows how old a Discord account is",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const created = target.createdAt;
    const ageMs = Date.now() - created.getTime();
    const days = Math.floor(ageMs / 86400000);
    const years = (days / 365).toFixed(1);
    const embed = infoEmbed(`Account Age — ${target.username}`,
      `**Created:** <t:${Math.floor(created.getTime()/1000)}:F>\n**Age:** ${years} years (${days.toLocaleString()} days)`
    ).setThumbnail(target.displayAvatarURL());
    message.reply({ embeds: [embed] });
  },
};
