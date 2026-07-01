import pg from "pg";
const { Pool } = pg;

let pool;

export async function initDb() {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  await pool.query("SELECT 1");
  return pool;
}

export function getDb() {
  return pool;
}

export async function query(sql, params = []) {
  return pool.query(sql, params);
}

export async function getGuildConfig(guildId) {
  const res = await query("SELECT * FROM guilds WHERE id = $1", [guildId]);
  if (res.rows.length === 0) {
    await query(
      "INSERT INTO guilds (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING",
      [guildId, "Unknown"]
    );
    return { id: guildId, prefix: "!", anti_nuke_enabled: true, anti_nuke_threshold: 5, anti_nuke_window: 10, bypass_roles: [], trusted_bots: [], language: "en", word_filter: [], xp_enabled: true, xp_rate: 15 };
  }
  return res.rows[0];
}

export async function getMember(userId, guildId) {
  const res = await query("SELECT * FROM members WHERE user_id = $1 AND guild_id = $2", [userId, guildId]);
  if (res.rows.length === 0) {
    await query("INSERT INTO members (user_id, guild_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [userId, guildId]);
    return { user_id: userId, guild_id: guildId, xp: 0, level: 0, coins: 0, warns: 0, strikes: 0 };
  }
  return res.rows[0];
}

export async function updateMember(userId, guildId, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const set = keys.map((k, i) => `${k} = $${i + 3}`).join(", ");
  await query(`UPDATE members SET ${set} WHERE user_id = $1 AND guild_id = $2`, [userId, guildId, ...values]);
}

export async function createCase(guildId, data) {
  const caseCount = await query("SELECT COUNT(*) FROM cases WHERE guild_id = $1", [guildId]);
  const caseId = parseInt(caseCount.rows[0].count) + 1;
  await query(
    "INSERT INTO cases (case_id, guild_id, user_id, moderator_id, action, reason, duration) VALUES ($1, $2, $3, $4, $5, $6, $7)",
    [caseId, guildId, data.userId, data.moderatorId, data.action, data.reason || "No reason", data.duration || null]
  );
  return caseId;
}
