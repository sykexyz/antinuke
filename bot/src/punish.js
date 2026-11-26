const store = require('./store');
const tracker = require('./tracker');
const { log } = require('./logs');

const FIVE_HOURS = 5 * 60 * 60 * 1000;

const key = (gid, uid) => `${gid}:${uid}`;
const isX = (gid, uid) => {
  const x = store.db.xtimeouts[key(gid, uid)];
  return !!x;
};

async function xtimeout(member, reason) {
  const until = Date.now() + FIVE_HOURS;
  store.db.xtimeouts[key(member.guild.id, member.id)] = { until, reason, at: Date.now() };
  store.save();
  await member.timeout(FIVE_HOURS, `rize xtimeout: ${reason}`).catch(() => {});
  if (member.voice?.channel) await member.voice.disconnect('xtimeout').catch(() => {});
}

function clearX(gid, uid) {
  delete store.db.xtimeouts[key(gid, uid)];
  store.save();
}

// called by every anti module. one place to decide what happens
async function punish(member, rule, detail = '') {
  if (!member || member.id === member.guild.ownerId) return;
  const cfg = store.guild(member.guild.id);
  let how = cfg.anti[rule]?.punish || 'xtimeout';
  tracker.violation(member.guild.id, member.id, rule);

  // Discord API does not permit timing out bots (error 400: Cannot timeout a bot).
  // External spam/raid bots must be banned (or kicked) immediately to halt floods.
  if (member.user?.bot && how === 'xtimeout') {
    how = 'ban';
  }

  let done = how;
  try {
    if (how === 'ban') {
      await member.ban({ reason: `rize anti ${rule}`, deleteMessageSeconds: 604800 });
    } else if (how === 'kick') {
      await member.kick(`rize anti ${rule}`);
    } else {
      await xtimeout(member, `anti ${rule}`);
    }
  } catch (e) {
    if (how === 'xtimeout') {
      try {
        await member.kick(`rize anti ${rule} (timeout fallback)`);
        done = 'kick (timeout failed)';
      } catch (e2) {
        done = `failed (${e.message}; kick: ${e2.message})`;
      }
    } else {
      done = `failed (${e.message})`;
    }
  }

  log(
    member.guild,
    `anti ${rule} triggered`,
    `**user** ${member} (\`${member.id}\`)\n**punishment** ${done}${detail ? `\n**details** ${detail}` : ''}`
  );
}

// re-apply timeouts on boot, and expire old ones
async function resume(client) {
  for (const [k, x] of Object.entries(store.db.xtimeouts)) {
    if (x.until < Date.now()) {
      delete store.db.xtimeouts[k];
      continue;
    }
    const [gid, uid] = k.split(':');
    const g = client.guilds.cache.get(gid);
    const m = g && (await g.members.fetch(uid).catch(() => null));
    if (m && !m.isCommunicationDisabled()) await m.timeout(x.until - Date.now(), 'rize xtimeout resumed').catch(() => {});
  }
  store.save();
}

module.exports = { punish, xtimeout, clearX, isX, resume, FIVE_HOURS };
