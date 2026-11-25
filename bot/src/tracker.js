// per-user activity. in memory on purpose - the violation count is the only thing worth persisting
const store = require('./store');

const users = new Map(); // `${guild}:${user}` -> stats

function get(gid, uid) {
  const k = `${gid}:${uid}`;
  let s = users.get(k);
  if (!s) {
    s = { msgs: [], total: 0, joins: 0, vcSince: null, vcMs: 0, threads: 0, lastSeen: null, channels: new Set() };
    users.set(k, s);
  }
  return s;
}

function message(msg) {
  const s = get(msg.guild.id, msg.author.id);
  const now = Date.now();
  s.msgs.push(now);
  s.msgs = s.msgs.filter((t) => now - t < 60_000);
  s.total++;
  s.lastSeen = now;
  s.channels.add(msg.channel.id);
  return s;
}

const perMinute = (gid, uid) => {
  const s = get(gid, uid);
  const now = Date.now();
  return s.msgs.filter((t) => now - t < 60_000).length;
};

function violation(gid, uid, rule) {
  const db = store.db;
  db.violations ??= {};
  const k = `${gid}:${uid}`;
  db.violations[k] ??= [];
  db.violations[k].push({ rule, at: Date.now() });
  db.violations[k] = db.violations[k].slice(-50);
  store.save();
}

const violations = (gid, uid) => store.db.violations?.[`${gid}:${uid}`] || [];

function vcJoin(gid, uid) {
  const s = get(gid, uid);
  s.vcSince = Date.now();
}
function vcLeave(gid, uid) {
  const s = get(gid, uid);
  if (s.vcSince) s.vcMs += Date.now() - s.vcSince;
  s.vcSince = null;
}
function vcTotal(gid, uid) {
  const s = get(gid, uid);
  return s.vcMs + (s.vcSince ? Date.now() - s.vcSince : 0);
}

module.exports = { get, message, perMinute, violation, violations, vcJoin, vcLeave, vcTotal };
