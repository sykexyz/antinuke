import { AuditLogEvent, PermissionFlagsBits } from "discord.js";
import { getGuildConfig, query } from "./db.js";
import { isBypassRole, isTrustedBot } from "../utils/permissions.js";
import { nukeAlertEmbed } from "../utils/embed.js";

const actionTracker = new Map();

export async function trackAction(guild, executorId, actionType, client) {
  const config = await getGuildConfig(guild.id);
  if (!config.anti_nuke_enabled) return false;

  // Check bypass roles
  const member = await guild.members.fetch(executorId).catch(() => null);
  if (!member) return false;
  if (guild.ownerId === executorId) return false;
  if (isBypassRole(member, config)) return false;
  if (member.user.bot && isTrustedBot(executorId, config)) return false;

  const key = `${guild.id}-${executorId}`;
  const now = Date.now();
  const window = (config.anti_nuke_window || 10) * 1000;
  const threshold = config.anti_nuke_threshold || 5;

  if (!actionTracker.has(key)) actionTracker.set(key, []);
  const actions = actionTracker.get(key).filter(a => now - a.time < window);
  actions.push({ time: now, type: actionType });
  actionTracker.set(key, actions);

  const relevant = actions.filter(a => a.type === actionType);
  if (relevant.length >= threshold) {
    actionTracker.delete(key);
    return await punishNuker(guild, member, actionType, config, client);
  }
  return false;
}

async function punishNuker(guild, member, actionType, config, client) {
  try {
    // Ban the nuker
    await guild.bans.create(member.id, { reason: `[Sentrix Anti-Nuke] ${actionType} spam detected` }).catch(() => {});

    // Log to DB
    await query(
      "INSERT INTO nuke_logs (guild_id, perpetrator_id, action, blocked) VALUES ($1, $2, $3, $4)",
      [guild.id, member.id, actionType, true]
    );

    // Alert owner
    const owner = await guild.fetchOwner().catch(() => null);
    if (owner) {
      await owner.send({ embeds: [nukeAlertEmbed(actionType, `${member.user.tag} (${member.id})`, guild.name)] }).catch(() => {});
    }

    // Alert log channel
    if (config.log_channel) {
      const ch = guild.channels.cache.get(config.log_channel);
      if (ch) await ch.send({ embeds: [nukeAlertEmbed(actionType, `${member.user.tag} (${member.id})`, guild.name)] }).catch(() => {});
    }

    return true;
  } catch (err) {
    console.error("[ANTI-NUKE] Punish error:", err.message);
    return false;
  }
}

export async function checkWebhookSpam(guild, webhookId, executorId, client) {
  return trackAction(guild, executorId, "WEBHOOK_CREATE", client);
}

export async function checkBotAdd(guild, botId, executorId, client) {
  const config = await getGuildConfig(guild.id);
  if (isTrustedBot(botId, config)) return false;
  return trackAction(guild, executorId, "BOT_ADD", client);
}
