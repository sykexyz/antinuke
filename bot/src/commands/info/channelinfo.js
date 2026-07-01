import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "channelinfo",
  description: "Shows stats about a channel",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const channel = message.mentions.channels.first() || message.channel;
    const types = { 0:"Text",2:"Voice",4:"Category",5:"Announcement",11:"Thread",12:"Thread",13:"Stage",15:"Forum" };
    const embed = infoEmbed(`Channel — #${channel.name}`,
      `**ID:** \`${channel.id}\`\n**Type:** ${types[channel.type] || "Unknown"}\n**Topic:** ${channel.topic || "None"}\n**NSFW:** ${channel.nsfw ? "Yes" : "No"}\n**Slowmode:** ${channel.rateLimitPerUser || 0}s\n**Created:** <t:${Math.floor(channel.createdTimestamp/1000)}:R>\n**Category:** ${channel.parent?.name || "None"}`
    );
    message.reply({ embeds: [embed] });
  },
};
