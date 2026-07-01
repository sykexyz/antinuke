import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "guildBanAdd",
  async execute(ban, client) {
    const config = await getGuildConfig(ban.guild.id).catch(() => null);
    if (!config?.mod_log_channel) return;
    const ch = ban.guild.channels.cache.get(config.mod_log_channel);
    if (!ch) return;
    const embed = new EmbedBuilder()
      .setColor(0xff3333)
      .setTitle("Member Banned")
      .setDescription(`**User:** ${ban.user.tag} (${ban.user.id})\n**Reason:** ${ban.reason || "No reason"}`)
      .setTimestamp();
    ch.send({ embeds: [embed] }).catch(() => {});
  },
};
