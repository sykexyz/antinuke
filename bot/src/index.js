require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const store = require('./store');
const anti = require('./anti');
const status = require('./status');
const { resume } = require('./punish');
const { ensureLogChannel } = require('./logs');
const cmds = require('./commands');

const token = (process.env.DISCORD_TOKEN || '').trim();
// tokens are 3 dot-separated chunks. not a full check, just catches empty / pasted-wrong
if (!token || token.split('.').length !== 3) {
  console.error('DISCORD_TOKEN is missing or doesn\'t look like a bot token. set it and restart.');
  process.exit(1);
}

const client = new Client({
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
  // global registration, app id comes from the logged in user
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
  if (!i.isChatInputCommand() || !i.guild) return;
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

// keep the process alive no matter what the host does
client.on('shardDisconnect', (_, id) => console.warn(`[rize] shard ${id} disconnected, discord.js will reconnect`));
client.on('shardReconnecting', (id) => console.log(`[rize] shard ${id} reconnecting`));
client.on('error', (e) => console.error('[client]', e.message));
process.on('unhandledRejection', (e) => console.error('[unhandled]', e));
process.on('uncaughtException', (e) => console.error('[uncaught]', e));

let closing = false;
async function shutdown(sig) {
  if (closing) return;
  closing = true;
  console.log(`[rize] ${sig}, saving and closing`);
  await store.flush();
  await client.destroy().catch(() => {});
  process.exit(0);
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

(async () => {
  await store.load();
  // login retries - some hosts start the container before the network is ready
  for (let tries = 1; ; tries++) {
    try {
      await client.login(token);
      break;
    } catch (e) {
      if (/TokenInvalid|invalid token/i.test(e.message)) {
        console.error('discord rejected the token. double check DISCORD_TOKEN.');
        process.exit(1);
      }
      const wait = Math.min(30, tries * 5);
      console.warn(`[rize] login failed (${e.message}), retrying in ${wait}s`);
      await new Promise((r) => setTimeout(r, wait * 1000));
    }
  }
})();
