# Rize & RizeSec

Discord security bot and Tokyo Ghoul red/white marketing site.

- **Website**: TanStack Start + Vite on Netlify with custom SVG kagune music player, interactive ink-hold button, 3D playing cards, and animated spider lily cursor.
- **Bot**: discord.js v14 with anti-nuke, anti-raid, 13 protection modules, per-user behavior tracking, and 5-hour `xtimeout`.
- **Hosting**: Netlify (`netlify.toml` + `netlify/functions/bot.js`) for the site and serverless function; persistent worker deployment guide for the bot gateway.

---

## 1. Quick Start

### Netlify Deployment (Website & Serverless Function)
1. Push to your GitHub repo and link it in Netlify.
2. In Netlify **Site settings → Environment variables**, add:
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```
3. Netlify runs `npm run build` and publishes `dist` with `netlify/functions` automatically.
4. Serverless health/status endpoint is live at `/.netlify/functions/bot` or `/api/bot`.

### Running the Bot (Persistent Worker)
Discord Gateway bots require a continuous WebSocket connection for real-time message and voice interception.

```bash
cd bot
npm install
DISCORD_TOKEN="your_bot_token" npm start
```

For 24/7 background hosting, deploy the `bot/` directory to Railway, Render, Fly.io, or VPS using PM2.

---

## 2. Discord Bot Configuration

### Required Environment Variable
Only one value is required:
```env
DISCORD_TOKEN=
```
- No hardcoded IDs or owner lists.
- Authority follows the server owner, the whitelist role, or role hierarchy.
- Optional: `MONGO_URI` for persistent multi-instance state sync. Defaults to in-memory with automatic rehydration.

### Key Commands
- `/help` — Full command list with custom emoji prefix (`<:rize:1574973435950538943>`).
- `/anti <module> <on|off>` — Toggle any of the 13 protection modules.
- `/punishment <module> <kick|ban|xtimeout>` — Configure enforcement action.
- `/antinuke stats` — Protection status display showing active/inactive sticker states.
- `/xtimeout <user>` — 5-hour timeout with real-time voice disconnect and thread wipe.
- `/unpunish <username>` — Lift xtimeout (requires role above target).
- `/monitor <user>` & `/userinfo <user>` — In-depth member analytics.

---

## 3. Discord Badges & Verification

1. **Active Developer**: Run any slash command, then claim at [discord.com/developers/active-developer](https://discord.com/developers/active-developer).
2. **Slash Commands Badge**: Automatically granted once slash commands are used across servers.
3. **Verified Bot**: After reaching 75 servers, submit for verification under Developer Portal → App Verification. Ensure Privileged Intents (Server Members, Message Content, Presence) are enabled.
4. **App Directory**: Submit your listing under General Information & App Directory.
5. **discord.bots.gg**: List your bot with your prefix and commands.

---

## 4. Brand & Assets
- **Application ID**: `1574970846311620608`
- **Add Bot URL**: `https://discord.com/oauth2/authorize?client_id=1574970846311620608`
- **Developer Bio**: `DEV >> https://kxle.ct.ws`
- **Developer Name**: Kyle Gaspari
