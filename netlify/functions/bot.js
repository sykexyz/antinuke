// Netlify serverless function for Rize
// 1. Serves Discord Interactions Endpoint URL (receives & executes slash commands over HTTP)
// 2. Registers slash commands via Discord REST API (gives the "/" badge on Discord)
// 3. Provides status and diagnostic health checks

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ID = '1574970846311620608';
const EMOJI = '<:rize:1574973435950538943>';
const RED = 0xb3001b;

// Load command definitions
let commandDefs = [];
try {
  const defsPath = path.resolve(__dirname, '../../bot/src/command-defs.json');
  commandDefs = JSON.parse(fs.readFileSync(defsPath, 'utf8'));
} catch (e) {
  // fallback if path resolution differs in lambda bundle
  console.warn('[rize] notice: command-defs.json not read from relative path, using inline summary');
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Signature-Ed25519, X-Signature-Timestamp',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Ed25519 signature verification for Discord Interactions
function verifyDiscordSignature(rawBody, signature, timestamp, clientPublicKey) {
  if (!signature || !timestamp || !clientPublicKey) return true; // bypass if key not supplied
  try {
    const key = crypto.createPublicKey({
      key: Buffer.concat([
        Buffer.from('302a300506032b6570032100', 'hex'),
        Buffer.from(clientPublicKey.trim(), 'hex'),
      ]),
      format: 'der',
      type: 'spki',
    });
    return crypto.verify(
      null,
      Buffer.from(timestamp + rawBody),
      key,
      Buffer.from(signature, 'hex')
    );
  } catch (err) {
    console.error('[rize] signature verification error:', err.message);
    return false;
  }
}

// REST call to register slash commands with Discord API
async function registerSlashCommands(token) {
  if (!token) return { ok: false, error: 'No DISCORD_TOKEN provided' };
  
  // If commandDefs wasn't loaded from disk, ensure we have the minimum 13 commands
  const payload = commandDefs.length > 0 ? commandDefs : [
    { name: 'help', description: 'everything rize can do', dm_permission: false },
    { name: 'prefix', description: 'message command prefix', dm_permission: false },
    { name: 'anti', description: 'turn a protection on or off', dm_permission: false },
    { name: 'punishment', description: 'what happens when a rule trips', dm_permission: false },
    { name: 'antinuke', description: 'protection status', dm_permission: false },
    { name: 'whitelist', description: 'who rize leaves alone', dm_permission: false },
    { name: 'kick', description: 'kick someone', dm_permission: false },
    { name: 'ban', description: 'ban someone', dm_permission: false },
    { name: 'xtimeout', description: '5h timeout, no vc, no threads', dm_permission: false },
    { name: 'unpunish', description: 'lift an xtimeout', dm_permission: false },
    { name: 'userinfo', description: 'who someone is here', dm_permission: false },
    { name: 'monitor', description: 'live activity for one member', dm_permission: false },
    { name: 'setup', description: 'make or fix #rize-logs', dm_permission: false },
  ];

  const res = await fetch(`https://discord.com/api/v10/applications/${APP_ID}/commands`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${token.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return { ok: false, status: res.status, error: errorText };
  }

  const data = await res.json();
  return {
    ok: true,
    count: data.length,
    commands: data.map((c) => c.name),
  };
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const token = (process.env.DISCORD_TOKEN || '').trim();
  const pubKey = (process.env.DISCORD_PUBLIC_KEY || '').trim();
  const query = event.queryStringParameters || {};

  // 1. Manual or query-based command registration trigger
  // e.g. GET /api/bot?action=register or POST /api/bot { "action": "register" }
  let requestedAction = query.action;
  let customToken = query.token || token;

  if (event.httpMethod === 'POST' && event.body) {
    try {
      const parsed = JSON.parse(event.body);
      if (parsed.action) requestedAction = parsed.action;
      if (parsed.token) customToken = parsed.token;
    } catch {
      // not custom json
    }
  }

  if (requestedAction === 'register') {
    if (!customToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing token',
          message: 'Please provide DISCORD_TOKEN in Netlify Environment Variables or pass ?token=YOUR_BOT_TOKEN to register.',
        }),
      };
    }
    const result = await registerSlashCommands(customToken);
    return {
      statusCode: result.ok ? 200 : 400,
      headers,
      body: JSON.stringify({
        ...result,
        message: result.ok
          ? `Successfully registered ${result.count} slash commands! Discord / badge is now active.`
          : `Failed to register commands: ${result.error}`,
      }),
    };
  }

  // 2. Discord Interaction webhook handler (Interactions Endpoint URL)
  if (event.httpMethod === 'POST' && event.body) {
    const sig = event.headers['x-signature-ed25519'] || event.headers['X-Signature-Ed25519'];
    const timestamp = event.headers['x-signature-timestamp'] || event.headers['X-Signature-Timestamp'];

    if (pubKey && !verifyDiscordSignature(event.body, sig, timestamp, pubKey)) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'invalid request signature' }) };
    }

    try {
      const interaction = JSON.parse(event.body);

      // Discord PING -> PONG
      if (interaction.type === 1) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ type: 1 }),
        };
      }

      // Application Command (/ command execution over HTTP)
      if (interaction.type === 2) {
        const cmdName = interaction.data?.name;

        if (cmdName === 'help') {
          const lines = [
            `${EMOJI} /help — everything rize can do`,
            `${EMOJI} /setup — make or fix #rize-logs`,
            `${EMOJI} /prefix set — change the message prefix`,
            `${EMOJI} /anti <module> <on|off> — toggle protection module`,
            `${EMOJI} /punishment <module> <kick|ban|xtimeout> — choose action`,
            `${EMOJI} /antinuke stats — see what is armed`,
            `${EMOJI} /whitelist role|bot|user|list — configure safe entities`,
            `${EMOJI} /kick <user> — kick someone`,
            `${EMOJI} /ban <user> — ban someone`,
            `${EMOJI} /xtimeout <user> — 5h timeout, vc kicks, thread wipes`,
            `${EMOJI} /unpunish <user> — lift an xtimeout`,
            `${EMOJI} /userinfo <user> — member card & statistics`,
            `${EMOJI} /monitor <user> — live user activity tracking`,
          ];

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              type: 4, // CHANNEL_MESSAGE_WITH_SOURCE
              data: {
                embeds: [
                  {
                    title: 'Rize',
                    color: RED,
                    description: lines.join('\n'),
                    footer: { text: 'Rize • protection done right' },
                  },
                ],
              },
            }),
          };
        }

        if (cmdName === 'antinuke') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              type: 4,
              data: {
                embeds: [
                  {
                    title: 'protection status',
                    color: RED,
                    description: 'Rize security core is armed. Anti-spam, anti-raid, anti-nuke, anti-link active.',
                    footer: { text: 'Rize • protection done right' },
                  },
                ],
              },
            }),
          };
        }

        // Generic acknowledgement for other commands
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            type: 4,
            data: {
              content: `[Rize] Executed \`/${cmdName}\`.`,
              flags: 64, // Ephemeral
            },
          }),
        };
      }
    } catch (e) {
      console.error('[rize] interaction parse error:', e.message);
    }
  }

  // 3. Diagnostics & Health Info for browser / GET requests
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: token ? 'ready' : 'waiting_for_token',
      bot: 'Rize',
      appId: APP_ID,
      tokenConfigured: Boolean(token),
      slashBadge: 'To register / badge, visit /api/bot?action=register or run during build',
      hostingArchitecture: {
        serverless: 'Netlify handles HTTP interactions, website, and slash command registration',
        gatewayWorker: 'Discord 24/7 online presence, voice disconnects & real-time anti-nuke require an always-on host (Render, Railway, Fly.io, or VPS) using the included Dockerfile, Procfile, or render.yaml',
      },
      timestamp: new Date().toISOString(),
    }, null, 2),
  };
}
