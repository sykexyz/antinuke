import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { initDb } from "./lib/db.js";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN_B64) {
  process.env.DISCORD_BOT_TOKEN = Buffer.from(process.env.DISCORD_BOT_TOKEN_B64, "base64").toString("utf-8");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember],
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.nukeTracker = new Map();
client.antiRaidTracker = new Map();
client.startTime = Date.now();

async function main() {
  try {
    await initDb();
    console.log("[DB] Database connected");
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.error("[FATAL]", err);
    process.exit(1);
  }
}

main();

export default client;
