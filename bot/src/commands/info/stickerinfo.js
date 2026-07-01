import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "stickerinfo",
  description: "Shows details about a server sticker",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const stickers = message.guild.stickers.cache;
    if (!stickers.size) return message.reply({ embeds: [errorEmbed("No Stickers", "This server has no stickers.")] });
    const name = args.join(" ").toLowerCase();
    const sticker = name ? stickers.find(s => s.name.toLowerCase().includes(name)) : stickers.first();
    if (!sticker) return message.reply({ embeds: [errorEmbed("Not Found", `No sticker matching \`${name}\`.`)] });
    const embed = infoEmbed(`Sticker — ${sticker.name}`,
      `**ID:** \`${sticker.id}\`\n**Description:** ${sticker.description || "None"}\n**Format:** ${sticker.format}\n**Available:** ${sticker.available ? "Yes" : "No"}\n**Created:** <t:${Math.floor(sticker.createdTimestamp/1000)}:R>`
    ).setThumbnail(sticker.url);
    message.reply({ embeds: [embed] });
  },
};
