// in-memory store with cold-start rehydration.
// writes to disk only when writable; never crashes on read-only serverless hosts.
// if MONGO_URI is set, syncs with mongo.
const fs = require('fs');
const path = require('path');

const ANTIS = ['spam', 'link', 'raid', 'nuke', 'thread', 'mention', 'caps', 'zalgo', 'emoji', 'ghostping', 'webhook', 'botadd', 'vanity'];

let db = { guilds: {}, xtimeouts: {}, violations: {} };
let mongoCol = null;
let saveTimer = null;
let writablePath = null;

function freshGuild() {
  const anti = {};
  for (const a of ANTIS) anti[a] = { on: false, punish: 'xtimeout' };
  return {
    prefix: '/',
    logChannel: null,
    wl: { role: null, bots: [], users: [] },
    anti,
  };
}

function resolvePath() {
  // test whether local folder or /tmp is writable
  const candidates = [
    path.join(__dirname, '..', 'data', 'db.json'),
    path.join('/tmp', 'rize-db.json'),
  ];
  for (const p of candidates) {
    try {
      const dir = path.dirname(p);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return p;
    } catch {
      // not writable, try next
    }
  }
  return null;
}

async function load() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      const { MongoClient } = require('mongodb');
      const c = new MongoClient(uri);
      await c.connect();
      mongoCol = c.db().collection('rize');
      const doc = await mongoCol.findOne({ _id: 'state' });
      if (doc) {
        db = {
          guilds: doc.guilds || {},
          xtimeouts: doc.xtimeouts || {},
          violations: doc.violations || {},
        };
      }
      console.log('[store] synced with mongo');
      return;
    } catch (e) {
      console.warn('[store] mongo connection failed, falling back to memory/local:', e.message);
      mongoCol = null;
    }
  }

  writablePath = resolvePath();
  if (writablePath && fs.existsSync(writablePath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(writablePath, 'utf8'));
      db.guilds = parsed.guilds || {};
      db.xtimeouts = parsed.xtimeouts || {};
      db.violations = parsed.violations || {};
      console.log(`[store] rehydrated from ${writablePath}`);
      return;
    } catch (e) {
      console.warn('[store] cached state file unreadable, starting in-memory:', e.message);
    }
  }
  console.log('[store] running in-memory cache');
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 800);
}

async function flush() {
  try {
    if (mongoCol) {
      await mongoCol.updateOne({ _id: 'state' }, { $set: db }, { upsert: true });
      return;
    }
    if (!writablePath) writablePath = resolvePath();
    if (writablePath) {
      const dir = path.dirname(writablePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(writablePath + '.tmp', JSON.stringify(db, null, 1));
      fs.renameSync(writablePath + '.tmp', writablePath);
    }
  } catch (e) {
    // on read-only environments (e.g. netlify lambdas), keep state in-memory quietly
    writablePath = null;
  }
}

function guild(id) {
  if (!db.guilds[id]) {
    db.guilds[id] = freshGuild();
    save();
  }
  const g = db.guilds[id];
  // ensure all anti keys exist
  for (const a of ANTIS) g.anti[a] ??= { on: false, punish: 'xtimeout' };
  return g;
}

module.exports = { load, save, flush, guild, ANTIS, get db() { return db; } };
