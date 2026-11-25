# Rize & RizeSec

Discord security bot and Tokyo Ghoul red/white marketing site.

- **Website**: TanStack Start + Vite on Netlify with custom SVG kagune music player, interactive ink-hold button, 3D playing cards, and animated spider lily cursor.
- **Bot**: discord.js v14 with anti-nuke, anti-raid, 13 protection modules, per-user behavior tracking, and 5-hour `xtimeout`.
- **Hosting**:
  - **Netlify**: Hosts the marketing site and stateless HTTP interactions.
  - **Persistent Host**: Runs the Discord Gateway bot process. Choose a host and plan that explicitly supports continuous workers for dependable 24/7 protection.

---

## 1. Commands and App Profile Labels

Rize registers its application commands globally. To register or refresh them, set `DISCORD_TOKEN` in the host environment and run:

```bash
npm run register:commands
```

The repo includes 14 slash commands plus two right-click app commands. Registering commands lets Discord process them, but code cannot force an app-profile label. Discord decides verification eligibility and approval in the Developer Portal. Add a support-server invite in the app profile settings if you want that link shown.

The Active Developer badge has been discontinued. Source-code labels and other directory badges are separate; submit Rize to the relevant bot directory and follow that site's review process. Rize cannot award those labels itself.

---

## 2. Why the Bot is Offline on Netlify & How to Make It 24/7 Online

### Why Netlify Shows the Bot as Offline
Netlify is a **serverless** platform designed for static sites and on-demand APIs. A function cannot hold Rize's Discord Gateway connection open between requests.

Discord bots only show as **Online** (with the green status or streaming presence) when there is an active, continuous **WebSocket connection** to the Discord Gateway (`wss://gateway.discord.gg`). Real-time features (auto-disconnecting voice channels on `xtimeout`, anti-raid join detection, message rate spam blocking) require this persistent connection.

### Hosting options (uptime depends on the host and plan)

#### Option 1: Render Free Web Service (may sleep)
1. Go to [render.com](https://render.com) and create a free account.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository `sykexyz/antinuke`.
4. Render will detect the included `render.yaml` file automatically.
5. In the environment variables prompt, enter your `DISCORD_TOKEN`.
6. Click **Apply** (or click **Manual sync** if already on the Blueprint screen). Render builds and starts the free web service!
7. *Note:* Render Free Web Services can sleep after inactivity. A health check or external ping is not a guarantee of continuous bot uptime. Use a plan or host that explicitly provides an always-on process for 24/7 protection.

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
2. Leave **Interactions Endpoint URL** unset when Rize is connected through its persistent Gateway host. Setting a separate webhook endpoint routes interactions away from the bot process and bypasses its interactive paginated help menu.

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
