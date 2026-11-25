const { ActivityType } = require('discord.js');
const { pad } = require('./util');

// cycles through every server, one line at a time
// online count needs presence intent; falls back to cached presences if it's off
let i = 0;

function lineFor(guild, n) {
  const online = guild.members.cache.filter((m) => m.presence && m.presence.status !== 'offline').size;
  const total = guild.memberCount.toLocaleString('en-US').padStart(4, '0');
  return `Server ${pad(n, 2)} — ${pad(online)} Online Members / ${total} Total Members`;
}

function tick(client) {
  const guilds = [...client.guilds.cache.values()];
  if (!guilds.length) return;
  i = i % guilds.length;
  client.user.setActivity(lineFor(guilds[i], i + 1), { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rize' });
  i++;
}

function start(client) {
  tick(client);
  setInterval(() => tick(client), 20_000).unref();
}

module.exports = { start, lineFor };
