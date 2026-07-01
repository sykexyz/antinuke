import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "announce",
  description: "Schedules an announcement in a channel after a delay",
  category: "extra",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    if (args.length < 3) return message.reply("Usage: `!announce #channel <delay> <message>`\nDelay: `30s`, `10m`, `2h`\nExample: `!announce #general 5m Server restart soon!`");
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply({ embeds: [errorEmbed("No Channel", "Mention a channel.")] });
    const delayStr = args[1];
    const units = { s: 1000, m: 60000, h: 3600000 };
    const match = delayStr.match(/^(\d+)(s|m|h)$/i);
    if (!match) return message.reply({ embeds: [errorEmbed("Invalid Delay", "Use `30s`, `10m`, or `2h`.")] });
    const ms = parseInt(match[1]) * units[match[2].toLowerCase()];
    if (ms > 86400000) return message.reply({ embeds: [errorEmbed("Too Long", "Max delay is 24 hours.")] });
    const text = args.slice(2).join(" ").slice(0, 2000);
    message.reply({ embeds: [successEmbed("Announcement Scheduled", `Will post in <#${channel.id}> in **${delayStr}**.`)] });
    setTimeout(async () => {
      await channel.send(`📢 **Announcement from ${message.author.username}:**\n\n${text}`).catch(() => {});
    }, ms);
  },
};
