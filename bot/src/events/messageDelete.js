import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

const snipeCache = new Map();

export function getSnipe(channelId) {
  return snipeCache.get(channelId) || null;
}

export default {
  name: "messageDelete",
  async execute(message, client) {
    if (!message.guild || message.author?.bot) return;

    // Store snipe
    if (message.content) {
      snipeCache.set(message.channelId, {
        content: message.content,
        author: message.author?.tag || "Unknown",
        timestamp: Date.now(),
      });
      setTimeout(() => snipeCache.delete(message.channelId), 5 * 60 * 1000);
    }

    const config = await getGuildConfig(message.guild.id).catch(() => null);
    if (!config?.log_channel) return;
    const ch = message.guild.channels.cache.get(config.log_channel);
    if (!ch) return;
    const embed = new EmbedBuilder()
      .setColor(0xff8800)
      .setTitle("Message Deleted")
      .setDescription(`**Author:** ${message.author?.tag || "Unknown"}\n**Channel:** <#${message.channelId}>\n**Content:** ${message.content?.slice(0, 1000) || "Unknown"}`)
      .setTimestamp();
    ch.send({ embeds: [embed] }).catch(() => {});
  },
};
