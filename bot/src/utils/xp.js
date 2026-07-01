import { getMember, updateMember } from "../lib/db.js";

export function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

export function levelFromXp(xp) {
  let level = 0;
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
  }
  return level;
}

export async function addXp(userId, guildId, amount, config) {
  const member = await getMember(userId, guildId);
  const newXp = (member.xp || 0) + amount;
  const oldLevel = member.level || 0;
  const newLevel = levelFromXp(newXp);
  await updateMember(userId, guildId, { xp: newXp, level: newLevel });
  return { leveled: newLevel > oldLevel, newLevel, oldLevel };
}
