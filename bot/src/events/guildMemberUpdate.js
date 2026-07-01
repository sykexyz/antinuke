import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client) {
    const config = await getGuildConfig(newMember.guild.id).catch(() => null);
    if (!config?.log_channel) return;
    const ch = newMember.guild.channels.cache.get(config.log_channel);
    if (!ch) return;

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;
    const added = newRoles.filter(r => !oldRoles.has(r.id));
    const removed = oldRoles.filter(r => !newRoles.has(r.id));

    if (added.size || removed.size) {
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("Roles Updated")
        .setDescription(`**User:** ${newMember.user.tag}\n${added.size ? `**Added:** ${added.map(r => r.name).join(", ")}` : ""}${removed.size ? `\n**Removed:** ${removed.map(r => r.name).join(", ")}` : ""}`)
        .setTimestamp();
      ch.send({ embeds: [embed] }).catch(() => {});
    }

    if (oldMember.nickname !== newMember.nickname) {
      const embed = new EmbedBuilder()
        .setColor(0xffcc00)
        .setTitle("Nickname Changed")
        .setDescription(`**User:** ${newMember.user.tag}\n**Before:** ${oldMember.nickname || "None"}\n**After:** ${newMember.nickname || "None"}`)
        .setTimestamp();
      ch.send({ embeds: [embed] }).catch(() => {});
    }
  },
};
