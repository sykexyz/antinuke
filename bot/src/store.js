// tiny storage layer. json file by default, mongo if MONGO_URI is set.
// everything lives in memory and gets flushed - good enough for a bot this size
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'data', 'db.json');
const ANTIS = ['spam', 'link', 'raid', 'nuke', 'thread', 'mention', 'caps', 'zalgo', 'emoji', 'ghostping', 'webhook', 'botadd', 'vanity'];

let db = { guilds: {}, xtimeouts: {} };
let mongoCol = null;
let saveTimer = null;

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

async function load() {
  const uri = process.env.MONGO_URI;
  if (uri) {
    try {
      const { MongoClient } = require('mongodb');
      const c = new MongoClient(uri);
      await c.connect();
      mongoCol = c.db().collection('rize');
      const doc = await mongoCol.findOne({ _id: 'state' });
      if (doc) db = { guilds: doc.guilds || {}, xtimeouts: doc.xtimeouts || {} };
      console.log('[store] using mongo');
      return;
    } catch (e) {
      console.warn('[store] mongo failed, falling back to json:', e.message);
      mongoCol = null;
    }
  }
  try {
    if (fs.existsSync(FILE)) db = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    db.guilds ??= {};
    db.xtimeouts ??= {};
  } catch (e) {
    console.warn('[store] db.json is busted, starting clean', e.message);
  }
  console.log('[store] using local json');
}

function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 800);
}

async function flush() {
  try {
    if (mongoCol) {
      await mongoCol.updateOne({ _id: 'state' }, { $set: db }, { upsert: true });
    } else {
      fs.mkdirSync(path.dirname(FILE), { recursive: true });
      fs.writeFileSync(FILE + '.tmp', JSON.stringify(db, null, 1));
      fs.renameSync(FILE + '.tmp', FILE);
    }
  } catch (e) {
    console.error('[store] save failed', e);
  }
}

function guild(id) {
  if (!db.guilds[id]) {
    db.guilds[id] = freshGuild();
    save();
  }
  const g = db.guilds[id];
  // new antis added later shouldn't break old configs
  for (const a of ANTIS) g.anti[a] ??= { on: false, punish: 'xtimeout' };
  return g;
}

module.exports = { load, save, flush, guild, ANTIS, get db() { return db; } };
