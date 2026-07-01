import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { loadCommands } from "./handlers/commandHandler.js";
import { loadEvents } from "./handlers/eventHandler.js";
import { initDb } from "./lib/db.js";
import dotenv from "dotenv";
import { writeFileSync, existsSync, readFileSync, unlinkSync } from "fs";

dotenv.config();

if (!process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN_B64) {
  process.env.DISCORD_BOT_TOKEN = Buffer.from(process.env.DISCORD_BOT_TOKEN_B64, "base64").toString("utf-8");
}

// ── Process singleton lock ────────────────────────────────────────────────────
// Prevents duplicate bot instances from running at the same time,
// which causes double/triple responses in Discord.
const LOCK_FILE = "/tmp/sentrix-bot.lock";

if (existsSync(LOCK_FILE)) {
  const oldPid = parseInt(readFileSync(LOCK_FILE, "utf-8").trim());
  if (!isNaN(oldPid) && oldPid !== process.pid) {
    try {
      process.kill(oldPid, "SIGTERM");
      console.log(`[LOCK] Killed old bot instance (PID ${oldPid})`);
      await new Promise(r => setTimeout(r, 2000));
    } catch {
      // Old process already dead, continue
    }
  }
}
writeFileSync(LOCK_FILE, String(process.pid));

// ─────────────────────────────────────────────────────────────────────────────

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

async function shutdown(signal) {
  console.log(`[BOT] Received ${signal} — shutting down cleanly`);
  try {
    if (existsSync(LOCK_FILE)) unlinkSync(LOCK_FILE);
    await client.destroy();
  } catch {}
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

process.on("uncaughtException", (err) => {
  console.error("[FATAL] Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled rejection:", reason);
});

async function main() {
  try {
    await initDb();
    console.log("[DB] Database connected");
    await loadCommands(client);
    await loadEvents(client);
    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (err) {
    console.error("[FATAL]", err);
    if (existsSync(LOCK_FILE)) unlinkSync(LOCK_FILE);
    process.exit(1);
  }
}

main();
