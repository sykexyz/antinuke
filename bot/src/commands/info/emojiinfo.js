import { infoEmbed, errorEmbed, successEmbed } from "../../utils/embed.js";

export default {
  name: "emojiinfo",
  description: "Shows info about a custom emoji — use 'steal' to add it to this server",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!emojiinfo <emoji>` or `!emojiinfo steal <emoji>`");
    const steal = args[0] === "steal";
    const raw = steal ? args[1] : args[0];
    const match = raw?.match(/<a?:(\w+):(\d+)>/);
    if (!match) return message.reply({ embeds: [errorEmbed("Invalid", "Provide a custom server emoji.")] });
    const [, name, id] = match;
    const animated = raw.startsWith("<a:");
    const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
    if (steal) {
      if (!message.member.permissions.has("ManageEmojisAndStickers"))
        return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Emojis permission.")] });
      try {
        const added = await message.guild.emojis.create({ attachment: url, name });
        return message.reply({ embeds: [successEmbed("Emoji Stolen", `Added **:${added.name}:** to this server!`)] });
      } catch (e) { return message.reply({ embeds: [errorEmbed("Failed", e.message)] }); }
    }
    const embed = infoEmbed(`Emoji — :${name}:`,
      `**Name:** \`:${name}:\`\n**ID:** \`${id}\`\n**Animated:** ${animated ? "Yes" : "No"}\n**URL:** [Click here](${url})`
    ).setThumbnail(url);
    message.reply({ embeds: [embed] });
  },
};
