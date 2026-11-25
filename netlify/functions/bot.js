// netlify serverless function for Rize
// provides health checks, interaction webhooks, and status diagnostics
const path = require('path');

let bot = null;
try {
  bot = require('../../bot/src/index');
} catch (e) {
  // if bot modules fail to resolve in bundled environment, fall back gracefully
  console.warn('[netlify-bot] bot module resolution notice:', e.message);
}

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Signature-Ed25519, X-Signature-Timestamp',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const token = (process.env.DISCORD_TOKEN || '').trim();

  // handle discord interaction pings (Type 1 PING -> PONG) if used as interaction endpoint
  if (event.httpMethod === 'POST' && event.body) {
    try {
      const payload = JSON.parse(event.body);
      if (payload.type === 1) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ type: 1 }),
        };
      }
    } catch {
      // not JSON or not interaction
    }
  }

  if (!token) {
    console.log('[rize] DISCORD_TOKEN is missing or not configured in Netlify environment variables.');
    console.log('[rize] Add DISCORD_TOKEN in Netlify Site Settings -> Environment variables to connect.');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'waiting_for_token',
        bot: 'Rize',
        appId: '1574970846311620608',
        message: 'Rize is deployed on Netlify. Add DISCORD_TOKEN in Site Settings -> Environment variables to connect.',
        timestamp: new Date().toISOString(),
      }),
    };
  }

  let client = null;
  if (bot && typeof bot.getClient === 'function') {
    client = bot.getClient();
  }

  const isReady = client?.isReady?.() || false;

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: isReady ? 'online' : 'connecting',
      bot: 'Rize',
      appId: '1574970846311620608',
      tag: client?.user?.tag || 'Rize#0000',
      guilds: client?.guilds?.cache?.size || 0,
      uptime: client?.uptime || 0,
      host: 'Netlify Functions',
      note: 'For 24/7 real-time voice & message event monitoring without serverless timeouts, host the bot process on Railway, Render, Fly.io, or VPS using the included Dockerfile/Procfile.',
      timestamp: new Date().toISOString(),
    }),
  };
};
