export function isOwner(userId) {
  const owners = (process.env.OWNER_IDS || "").split(",").map(s => s.trim());
  return owners.includes(userId);
}

export function isBypassRole(member, config) {
  if (!config.bypass_roles || !Array.isArray(config.bypass_roles)) return false;
  return member.roles.cache.some(r => config.bypass_roles.includes(r.id));
}

export function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

export function isTrustedBot(userId, config) {
  if (!config.trusted_bots || !Array.isArray(config.trusted_bots)) return false;
  return config.trusted_bots.includes(userId);
}

export function canModerate(moderator, target) {
  if (!target.manageable) return false;
  if (moderator.roles.highest.comparePositionTo(target.roles.highest) <= 0) return false;
  return true;
}
