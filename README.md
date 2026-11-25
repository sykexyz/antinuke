# Rize & RizeSec

Discord security bot and Tokyo Ghoul red/white marketing site.

- **Website**: TanStack Start + Vite on Netlify with custom SVG kagune music player, interactive ink-hold button, 3D playing cards, and animated spider lily cursor.
- **Bot**: discord.js v14 with anti-nuke, anti-raid, 13 protection modules, per-user behavior tracking, and 5-hour `xtimeout`.
- **Hosting**:
  - **Netlify**: Hosts the marketing site, serverless HTTP interactions, and instant command registration API (`/.netlify/functions/bot`).
  - **24/7 Persistent Host**: Keeps the bot **Online** (green streaming presence, real-time voice channel kicks, and anti-nuke) via Render, Railway, Fly.io, or VPS.

---

## 1. Getting the `/` (Slash Commands) Badge

To make the `/` badge appear on Discord and enable all 13 slash commands:

### Option A: Via Your Netlify Site (Fastest)
1. In your Netlify dashboard, make sure `DISCORD_TOKEN` is added under **Site configuration → Environment variables**.
2. Open in your browser:
   ```
   https://<your-site-name>.netlify.app/api/bot?action=register
   ```
   *(Or if you haven't set Netlify env variables yet: `https://<your-site-name>.netlify.app/api/bot?action=register&token=YOUR_DISCORD_TOKEN`)*
3. You will receive a JSON response: `Successfully registered 13 slash commands! Discord / badge is now active.`

### Option B: From Terminal / Local
```bash
DISCORD_TOKEN="your_bot_token" npm run register:commands
```

Once registered, Discord immediately attaches the `/` badge to Rize's profile and lists commands in all servers.

---

## 2. Why the Bot is Offline on Netlify & How to Make It 24/7 Online

### Why Netlify Shows the Bot as Offline
Netlify is a **serverless** platform designed for static sites and on-demand APIs. Serverless functions spin down after execution (max 10–26 seconds). 

Discord bots only show as **Online** (with the green status or streaming presence) when there is an active, continuous **WebSocket connection** to the Discord Gateway (`wss://gateway.discord.gg`). Real-time features (auto-disconnecting voice channels on `xtimeout`, anti-raid join detection, message rate spam blocking) require this persistent connection.

### How to Keep Rize Online 24/7 (Free Options)

#### Option 1: Render.com (Recommended - 1 Click)
1. Go to [render.com](https://render.com) and create a free account.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository `sykexyz/antinuke`.
4. Render will detect the included `render.yaml` file automatically.
5. In the environment variables prompt, enter your `DISCORD_TOKEN`.
6. Click **Apply**. Render starts the bot worker and keeps it **Online 24/7**!

#### Option 2: Railway
1. Go to [railway.app](https://railway.app) and create a project from your GitHub repo.
2. Railway detects the included `railway.json` and `Procfile`.
3. Add variable: `DISCORD_TOKEN = your_bot_token`.
4. Deploy!

#### Option 3: VPS / Local with PM2
```bash
git clone https://github.com/sykexyz/antinuke.git
cd antinuke
npm run bot:install
DISCORD_TOKEN="your_token" pm2 start "npm run bot:start" --name rize
```

---

## 3. Discord Developer Portal Settings

Make sure these settings are configured at [discord.com/developers/applications/1574970846311620608](https://discord.com/developers/applications/1574970846311620608):

1. **Privileged Gateway Intents** (under **Bot** tab):
   - [x] **Presence Intent** (required for rotating streaming status)
   - [x] **Server Members Intent** (required for tracking, role hierarchy, anti-raid)
   - [x] **Message Content Intent** (required for message spam, link detection, anti-ghostping)
2. **Interactions Endpoint URL** (optional, under **General Information**):
   ```
   https://<your-site-name>.netlify.app/api/bot
   ```
   When configured, slash commands can be served directly by Netlify over HTTP!

---

## 4. Key Commands
- `/help` — Full command list with custom emoji prefix (`<:rize:1574973435950538943>`).
- `/anti <module> <on|off>` — Toggle any of the 13 protection modules.
- `/punishment <module> <kick|ban|xtimeout>` — Configure enforcement action.
- `/antinuke stats` — Protection status display showing active/inactive sticker states.
- `/xtimeout <user>` — 5-hour timeout with real-time voice disconnect and thread wipe.
- `/unpunish <username>` — Lift xtimeout (requires role above target).
- `/monitor <user>` & `/userinfo <user>` — In-depth member analytics.

---

## 5. Brand & Assets
- **Application ID**: `1574970846311620608`
- **Add Bot URL**: `https://discord.com/oauth2/authorize?client_id=1574970846311620608`
- **Developer Bio**: `DEV >> https://kxle.ct.ws`
