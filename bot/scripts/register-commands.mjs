// Registers Rize application commands to Discord REST API globally
// Can be run during build, via CLI, or triggered on deploy

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ID = '1574970846311620608';
const token = (process.env.DISCORD_TOKEN || '').trim();

// Load command definitions
const defsPath = path.resolve(__dirname, '../src/command-defs.json');
let commands = [];
try {
  commands = JSON.parse(fs.readFileSync(defsPath, 'utf8'));
} catch (e) {
  console.error('[rize] failed to load command-defs.json:', e.message);
}

export async function registerCommands(customToken) {
  const activeToken = (customToken || token).trim();
  if (!activeToken) {
    console.log('[rize] DISCORD_TOKEN is not set. Skipping command registration.');
    console.log('[rize] Set DISCORD_TOKEN in Netlify Site Settings -> Environment variables.');
    return { ok: false, error: 'missing_token' };
  }

  if (commands.length === 0) {
    console.error('[rize] No commands found to register.');
    return { ok: false, error: 'no_commands' };
  }

  const url = `https://discord.com/api/v10/applications/${APP_ID}/commands`;
  console.log(`[rize] Registering ${commands.length} global application commands (Application ID: ${APP_ID})...`);

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${activeToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[rize] Discord API error (${res.status}): ${text}`);
      return { ok: false, status: res.status, error: text };
    }

    const data = await res.json();
    console.log(`[rize] Registered ${data.length} global application commands with Discord.`);
    console.log('[rize] Profile labels are controlled by Discord and may take time to update.');
    return { ok: true, count: data.length, commands: data.map((c) => c.name) };
  } catch (e) {
    console.error('[rize] Network error while registering commands:', e.message);
    return { ok: false, error: e.message };
  }
}

// If executed directly
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  registerCommands().then(() => {
    process.exit(0);
  });
}
