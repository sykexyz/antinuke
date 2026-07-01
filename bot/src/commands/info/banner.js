import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "banner",
  description: "Shows the banner of a user or the server",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (args[0] === "server") {
      const guild = await message.guild.fetch();
      const url = guild.bannerURL({ size: 1024 });
      if (!url) return message.reply({ embeds: [errorEmbed("No Banner", "This server has no banner.")] });
      return message.reply({ embeds: [infoEmbed(`Banner — ${guild.name}`, `[Download](${url})`).setImage(url)] });
    }
    const target = message.mentions.users.first() || message.author;
    const fetched = await target.fetch().catch(() => null);
    const url = fetched?.bannerURL({ size: 1024 });
    if (!url) return message.reply({ embeds: [errorEmbed("No Banner", `**${target.username}** has no banner.`)] });
    message.reply({ embeds: [infoEmbed(`Banner — ${target.username}`, `[Download](${url})`).setImage(url)] });
  },
};
