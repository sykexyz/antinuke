import { ActivityType } from "discord.js";
import { query } from "../lib/db.js";

const statuses = [
  { name: "sentrix.app", type: ActivityType.Watching },
  { name: "/help | Sentrix Bot", type: ActivityType.Playing },
  { name: "over your server", type: ActivityType.Watching },
  { name: "for nuke attempts", type: ActivityType.Watching },
];

let statusIdx = 0;

export default {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`[BOT] Logged in as ${client.user.tag}`);
    client.user.setPresence({ status: "online", activities: [statuses[0]] });

    setInterval(() => {
      statusIdx = (statusIdx + 1) % statuses.length;
      client.user.setPresence({ status: "online", activities: [statuses[statusIdx]] });
    }, 30000);

    try {
      const serverCount = client.guilds.cache.size;
      const userCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
      await query(
        "INSERT INTO bot_stats (server_count, user_count, command_count) VALUES ($1, $2, $3)",
        [serverCount, userCount, 200]
      );
    } catch (e) {
      console.error("[STATS] Failed to record stats:", e.message);
    }
  },
};
