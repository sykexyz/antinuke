import { getGuildConfig, getMember, updateMember } from "../lib/db.js";
import { addXp } from "../utils/xp.js";
import { isBypassRole } from "../utils/permissions.js";
import { errorEmbed } from "../utils/embed.js";
import autoMod from "../lib/automod.js";

const xpCooldowns = new Map();

export default {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;

    const config = await getGuildConfig(message.guild.id);
    const prefix = config.prefix || "!";

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

    // Auto-responder
    if (config.auto_responder) {
      for (const [keyword, response] of Object.entries(config.auto_responder)) {
        if (message.content.toLowerCase().includes(keyword.toLowerCase())) {
          await message.channel.send(response);
          return;
        }
      }
    }

    // Prefix commands
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    // Owner-only check
    if (command.ownerOnly && message.author.id !== message.guild.ownerId) {
      return message.reply({ embeds: [errorEmbed("No Permission", "Only the server owner can use this command.")] });
    }

    // Cooldowns
    if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Map());
    const now = Date.now();
    const timestamps = client.cooldowns.get(command.name);
    const cooldown = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
      const expiry = timestamps.get(message.author.id) + cooldown;
      if (now < expiry) {
        const remaining = ((expiry - now) / 1000).toFixed(1);
        return message.reply({ embeds: [errorEmbed("Cooldown", `Wait **${remaining}s** before using \`${command.name}\` again.`)] });
      }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldown);

    try {
      await command.execute(message, args, client, config);
    } catch (err) {
      console.error(`[CMD] Error in ${command.name}:`, err);
      message.reply({ embeds: [errorEmbed("Error", "An error occurred. Please try again.")] }).catch(() => {});
    }
  },
};
