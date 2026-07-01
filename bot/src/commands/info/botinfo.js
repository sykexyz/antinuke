import { infoEmbed } from "../../utils/embed.js";
import os from "os";

export default {
  name: "botinfo",
  description: "Shows bot stats — uptime, ping, version, server count",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message, args, client) {
    const uptime = process.uptime();
    const d = Math.floor(uptime/86400), h = Math.floor((uptime%86400)/3600), m = Math.floor((uptime%3600)/60), s = Math.floor(uptime%60);
    const mem = process.memoryUsage();
    const embed = infoEmbed("Bot Info",
      `**Ping:** ${client.ws.ping}ms\n**Uptime:** ${d}d ${h}h ${m}m ${s}s\n**Servers:** ${client.guilds.cache.size}\n**Users:** ${client.users.cache.size}\n**Commands:** ${client.commands.size}\n**Node.js:** ${process.version}\n**Memory:** ${(mem.heapUsed/1024/1024).toFixed(1)} MB\n**Platform:** ${os.platform()}`
    ).setThumbnail(client.user.displayAvatarURL());
    message.reply({ embeds: [embed] });
  },
};
