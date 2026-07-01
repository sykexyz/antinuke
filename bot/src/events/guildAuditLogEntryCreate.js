import { AuditLogEvent } from "discord.js";
import { trackAction } from "../lib/antiNuke.js";
import { getGuildConfig } from "../lib/db.js";

export default {
  name: "guildAuditLogEntryCreate",
  async execute(entry, guild, client) {
    if (!entry.executorId) return;

    const config = await getGuildConfig(guild.id).catch(() => null);
    if (!config?.anti_nuke_enabled) return;

    const actionMap = {
      [AuditLogEvent.ChannelDelete]: "CHANNEL_DELETE",
      [AuditLogEvent.ChannelCreate]: "CHANNEL_CREATE",
      [AuditLogEvent.RoleDelete]: "ROLE_DELETE",
      [AuditLogEvent.RoleCreate]: "ROLE_CREATE",
      [AuditLogEvent.MemberBanAdd]: "MASS_BAN",
      [AuditLogEvent.MemberKick]: "MASS_KICK",
      [AuditLogEvent.WebhookCreate]: "WEBHOOK_SPAM",
      [AuditLogEvent.GuildUpdate]: "GUILD_UPDATE",
      [AuditLogEvent.MemberRoleUpdate]: "ROLE_ESCALATION",
    };

    const actionType = actionMap[entry.action];
    if (!actionType) return;

    // Check for admin grant
    if (entry.action === AuditLogEvent.MemberRoleUpdate) {
      const changes = entry.changes || [];
      const addedRoles = changes.find(c => c.key === "$add")?.new || [];
      for (const role of addedRoles) {
        const guildRole = guild.roles.cache.get(role.id);
        if (guildRole?.permissions.has("Administrator")) {
          await trackAction(guild, entry.executorId, "ADMIN_GRANT", client);
        }
      }
      return;
    }

    // Guild name/icon change detection
    if (entry.action === AuditLogEvent.GuildUpdate) {
      if (config.log_channel) {
        const ch = guild.channels.cache.get(config.log_channel);
        if (ch) ch.send(`⚠️ **Server Updated** by <@${entry.executorId}>`).catch(() => {});
      }
      return;
    }

    await trackAction(guild, entry.executorId, actionType, client);
  },
};
