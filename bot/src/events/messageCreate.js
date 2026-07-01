import { getGuildConfig, getMember, updateMember } from "../lib/db.js";
import { addXp } from "../utils/xp.js";
import autoMod from "../lib/automod.js";
import { errorEmbed } from "../utils/embed.js";

const xpCooldowns = new Map();
const cmdCooldowns = new Map();

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const config = await getGuildConfig(message.guild.id);
    const prefix = config.prefix || "!";

    if (config.auto_mod_enabled) {
      const blocked = await autoMod(message, config);
      if (blocked) return;
    }

    if (config.auto_responder) {
      for (const [keyword, response] of Object.entries(config.auto_responder)) {
        if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
          await message.channel.send(response);
          return;
        }
      }
    }

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

    const member = await getMember(message.author.id, message.guild.id).catch(() => null);
    if (member?.afk) {
      await updateMember(message.author.id, message.guild.id, { afk: null }).catch(() => {});
      message.reply(`👋 Welcome back **${message.author.username}**! AFK removed.`).catch(() => {});
    }

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    if (!commandName) return;

    const command = client.commands.get(commandName);
    if (!command || !command.prefix) return;

    if (command.cooldown) {
      const key = `${message.author.id}-${commandName}`;
      const now = Date.now();
      const last = cmdCooldowns.get(key) || 0;
      if (now - last < command.cooldown * 1000) {
        const left = ((command.cooldown * 1000 - (now - last)) / 1000).toFixed(1);
        return message.reply({ embeds: [errorEmbed("Cooldown", `Wait **${left}s** before using this again.`)] });
      }
      cmdCooldowns.set(key, now);
    }

    try {
      await command.execute(message, args, client);
    } catch (err) {
      console.error(`[CMD ERR] ${commandName}:`, err);
      message.reply({ embeds: [errorEmbed("Error", "Something went wrong.")] }).catch(() => {});
    }
  },
};
