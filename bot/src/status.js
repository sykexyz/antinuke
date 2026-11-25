const { ActivityType } = require('discord.js');
const { pad } = require('./util');

let i = 0;

function lineFor(guild, n) {
  const online = guild.members.cache.filter((m) => m.presence && m.presence.status !== 'offline').size;
  const count = guild.memberCount || 0;
  const total = count >= 1000 ? count.toLocaleString('en-US') : pad(count, 4);
  return `Server ${pad(n, 2)} — ${pad(online, 4)} Online Members / ${total} Total Members`;
}

function tick(client) {
  const guilds = [...client.guilds.cache.values()];
  if (!guilds.length) return;
  i = i % guilds.length;
  const line = lineFor(guilds[i], i + 1);
  client.user.setActivity(line, { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rize' });
  i++;
}

function start(client) {
  tick(client);
  setInterval(() => tick(client), 20_000).unref();
}

module.exports = { start, lineFor };
