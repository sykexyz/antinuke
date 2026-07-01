import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

const editSnipeCache = new Map();

export function getEditSnipe(channelId) {
  return editSnipeCache.get(channelId) || null;
}

export default {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    editSnipeCache.set(oldMessage.channelId, {
      before: oldMessage.content,
      after: newMessage.content,
      author: oldMessage.author?.tag || "Unknown",
      timestamp: Date.now(),
    });
    setTimeout(() => editSnipeCache.delete(oldMessage.channelId), 5 * 60 * 1000);

    const config = await getGuildConfig(oldMessage.guild.id).catch(() => null);
    if (!config?.log_channel) return;
    const ch = oldMessage.guild.channels.cache.get(config.log_channel);
    if (!ch) return;
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle("Message Edited")
      .setDescription(`**Author:** ${oldMessage.author?.tag}\n**Channel:** <#${oldMessage.channelId}>\n**Before:** ${oldMessage.content?.slice(0, 500) || "Unknown"}\n**After:** ${newMessage.content?.slice(0, 500)}`)
      .setTimestamp();
    ch.send({ embeds: [embed] }).catch(() => {});
  },
};
