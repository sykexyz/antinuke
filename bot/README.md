# Rize

Discord security and moderation. One env var, runs anywhere with Node 20+.

## Setup

1. Make a bot at https://discord.com/developers/applications (Rize's app id is `1574970846311620608`).
2. Under **Bot**, turn on all three privileged intents: Presence, Server Members, Message Content.
3. Copy the token into `DISCORD_TOKEN`. That's it.

```
cp .env.example .env
npm install
npm start
```

Add it to a server: https://discord.com/oauth2/authorize?client_id=1574970846311620608

Slash commands register globally on boot. First time can take a few minutes to show up everywhere.

Bio for the developer portal: `DEV >> https://kxle.ct.ws`

## Optional

- `MONGO_URI` — if set, state goes to Mongo instead of `data/db.json`. If Mongo is down, it falls back to json.

## Hosting

| host | how |
| --- | --- |
| VPS / bare metal | `npm install && npm start`, keep alive with pm2 or systemd |
| Docker | `docker build -t rize . && docker run -d -e DISCORD_TOKEN=xxx -v $(pwd)/data:/app/data rize` |
| Pterodactyl | Node.js egg, startup file `src/index.js`, set `DISCORD_TOKEN` in Startup vars |
| Railway | new project from repo, root `bot/`, add `DISCORD_TOKEN`. uses the Procfile |
| Render | **Background Worker**, build `npm install`, start `npm start` |
| Fly.io | `fly launch` (picks up the Dockerfile), `fly secrets set DISCORD_TOKEN=xxx`, mount a volume at `/app/data` |
| Heroku | push, `heroku config:set DISCORD_TOKEN=xxx`, `heroku ps:scale worker=1` |
| Replit | import, add `DISCORD_TOKEN` in Secrets, hit Run |

Ephemeral disks (Heroku, Render free) wipe `data/` on restart. Use `MONGO_URI` there.

## How authority works

No owner ids, nothing hardcoded. In every server:

- the server owner can do everything
- the whitelist role (`/whitelist role add`) can configure Rize
- anyone whose top role sits above Rize's top role can configure it
- to punish someone, you and Rize both need to be above them

## Protections

`spam` `link` `raid` `nuke` `thread` `mention` `caps` `zalgo` `emoji` `ghostping` `webhook` `botadd` `vanity`

Turn one on with `/anti <name> on`, pick what happens with `/punishment <name> <kick|ban|xtimeout>`. Whitelisted users, bots and the whitelist role are skipped.

`thread` on means nobody outside the whitelist can make threads at all.

## xtimeout

- 5 hour Discord timeout
- joins any voice channel, gets disconnected instantly
- makes a thread, it's deleted
- leaving and rejoining reapplies it
- survives restarts (stored with the rest of the config)
- only someone above the punished member lifts it: `/unpunish username:@user`

## Logs

`#rize-logs` gets created on join (needs Manage Channels). Hidden from everyone except Rize and the whitelist role. Exists already? It gets reused. Run `/setup` any time to fix it.

## Status

Streaming status rotates every 20s through every server:

```
Server 01 — 0423 Online Members / 1,204 Total Members
```

## Badges

- **Slash Commands badge** — automatic once the bot has global slash commands and enough usage. Nothing to do.
- **Verified Bot** — once you're in 75+ servers, go to the dev portal → App Verification. Needs ID verification and the privileged intents justified (we use members, presence and message content for the anti modules and status).
- **Support Server** — dev portal → General Information, link a public support server once verified.
- **Active Developer** (on your own account) — run any slash command in the last 30 days, then claim at https://discord.com/developers/active-developer.
- **Coded / listed** — submit to https://discord.bots.gg and https://top.gg. bots.gg wants a working prefix, a help command and a short description.
- **Supports Commands / App Directory** — dev portal → App Directory, fill out the listing once verified.

## Emojis and stickers

`/help` prefixes every line with `<:rize:1574973435950538943>`. Upload that emoji to a server Rize is in (or as an application emoji) so it renders.

Stickers can't go inline in embeds, so on/off markers use the sticker ids `1574987768696799352` (on) and `1574987772417282228` (off) as emoji-style references. Upload matching application emojis with those ids' art if you want them to render as images.
