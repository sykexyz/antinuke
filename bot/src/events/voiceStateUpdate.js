import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    const config = await getGuildConfig(newState.guild.id).catch(() => null);
    if (!config?.log_channel) return;
    const ch = newState.guild.channels.cache.get(config.log_channel);
    if (!ch) return;

    let desc = null;
    if (!oldState.channelId && newState.channelId) {
      desc = `**${newState.member?.user.tag}** joined <#${newState.channelId}>`;
    } else if (oldState.channelId && !newState.channelId) {
      desc = `**${oldState.member?.user.tag}** left <#${oldState.channelId}>`;
    } else if (oldState.channelId !== newState.channelId) {
      desc = `**${newState.member?.user.tag}** moved from <#${oldState.channelId}> to <#${newState.channelId}>`;
    }

    if (desc) {
      const embed = new EmbedBuilder().setColor(0x00ff41).setTitle("Voice State Update").setDescription(desc).setTimestamp();
      ch.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
