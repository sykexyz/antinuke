require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const store = require('./store');
const anti = require('./anti');
const status = require('./status');
const { resume } = require('./punish');
const { ensureLogChannel } = require('./logs');
const cmds = require('./commands');

const token = (process.env.DISCORD_TOKEN || '').trim();

let client = null;

function createClient() {
  if (client) return client;
  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildModeration,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildWebhooks,
      GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
  });

  client.once(Events.ClientReady, async (c) => {
    console.log(`[rize] up as ${c.user.tag} (${c.user.id}) in ${c.guilds.cache.size} servers`);
    try {
      await c.application.commands.set(cmds.defs);
      console.log(`[rize] ${cmds.defs.length} slash commands registered`);
    } catch (e) {
      console.error('[rize] command registration failed', e.message);
    }
    for (const g of c.guilds.cache.values()) store.guild(g.id);
    await resume(c).catch(console.error);
    status.start(c);
  });

  client.on(Events.GuildCreate, async (g) => {
    store.guild(g.id);
    await ensureLogChannel(g).catch(() => {});
  });

  client.on(Events.InteractionCreate, async (i) => {
    if (!i.isChatInputCommand()) return;
    const fn = cmds.run[i.commandName];
    if (!fn) return;
    try {
      await fn(cmds.fromSlash(i));
    } catch (e) {
      console.error(`[cmd ${i.commandName}]`, e);
      const p = { content: 'something broke on my end. try again.', ephemeral: true };
      (i.replied || i.deferred ? i.followUp(p) : i.reply(p)).catch(() => {});
    }
  });

  client.on(Events.MessageCreate, async (msg) => {
    if (!msg.guild || msg.author.bot) return;
    const { prefix } = store.guild(msg.guild.id);
    if (!msg.content.startsWith(prefix)) return;
    const [name, ...args] = msg.content.slice(prefix.length).trim().split(/\s+/);
    const fn = cmds.run[name?.toLowerCase()];
    if (!fn) return;
    try {
      await fn(cmds.fromMessage(msg, name.toLowerCase(), args));
    } catch (e) {
      console.error(`[msgcmd ${name}]`, e);
    }
  });

  anti.wire(client);

  client.on('shardDisconnect', (_, id) => console.warn(`[rize] shard ${id} disconnected, discord.js will reconnect`));
  client.on('shardReconnecting', (id) => console.log(`[rize] shard ${id} reconnecting`));
  client.on('error', (e) => console.error('[client]', e.message));

  return client;
}

process.on('unhandledRejection', (e) => console.error('[unhandled]', e));
process.on('uncaughtException', (e) => console.error('[uncaught]', e));

let closing = false;
async function shutdown(sig) {
  if (closing) return;
  closing = true;
  console.log(`[rize] ${sig}, saving and closing`);
  await store.flush();
  if (client) await client.destroy().catch(() => {});
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

async function start() {
  if (!token || token.split('.').length !== 3) {
    console.log('[rize] DISCORD_TOKEN is missing or not configured in Netlify environment variables.');
    console.log('[rize] Add DISCORD_TOKEN in Site Settings -> Environment variables to connect the bot.');
    return null;
  }

  await store.load();
  const c = createClient();

  for (let tries = 1; tries <= 5; tries++) {
    try {
      await c.login(token);
      return c;
    } catch (e) {
      if (/TokenInvalid|invalid token/i.test(e.message)) {
        console.error('[rize] discord rejected the token. double check DISCORD_TOKEN.');
        return null;
      }
      const wait = Math.min(30, tries * 5);
      console.warn(`[rize] login attempt ${tries} failed (${e.message}), retrying in ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
  return null;
}

// only run directly if this file is the entry point
if (require.main === module) {
  start().catch((err) => {
    console.error('[rize] startup failed:', err.message);
  });
}

module.exports = { start, createClient, getClient: () => client };
