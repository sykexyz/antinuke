import { getGuildConfig, getMember, updateMember } from "../lib/db.js";
import { addXp } from "../utils/xp.js";
import autoMod from "../lib/automod.js";

const xpCooldowns = new Map();

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const config = await getGuildConfig(message.guild.id);

    // Auto-mod
    if (config.auto_mod_enabled) {
      const blocked = await autoMod(message, config);
      if (blocked) return;
    }

    // XP gain
    if (config.xp_enabled) {
      const key = `${message.author.id}-${message.guild.id}`;
      const now = Date.now();
      const last = xpCooldowns.get(key) || 0;
      if (now - last > 60000) {
        xpCooldowns.set(key, now);
        const xpAmount = Math.floor(Math.random() * 10) + (config.xp_rate || 15);
        const result = await addXp(message.author.id, message.guild.id, xpAmount, config);
        if (result.leveled && config.level_up_channel) {
          const ch = message.guild.channels.cache.get(config.level_up_channel);
          if (ch) ch.send(`🎉 **${message.author.username}** leveled up to **Level ${result.newLevel}**!`);
        }
      }
    }

    // AFK auto-clear
    const member = await getMember(message.author.id, message.guild.id).catch(() => null);
    if (member?.afk) {
      await updateMember(message.author.id, message.guild.id, { afk: null }).catch(() => {});
    }

    // Auto-responder
    if (config.auto_responder) {
      for (const [keyword, response] of Object.entries(config.auto_responder)) {
        if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
          await message.channel.send(response);
          return;
        }
      }
    }
  },
};
