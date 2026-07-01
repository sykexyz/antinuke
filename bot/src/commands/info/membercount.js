import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "membercount",
  description: "Shows member breakdown for the server",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    await message.guild.members.fetch();
    const all = message.guild.members.cache;
    const humans = all.filter(m => !m.user.bot).size;
    const bots = all.filter(m => m.user.bot).size;
    const online = all.filter(m => m.presence?.status === "online").size;
    const idle = all.filter(m => m.presence?.status === "idle").size;
    const dnd = all.filter(m => m.presence?.status === "dnd").size;
    const offline = all.size - online - idle - dnd;
    const embed = infoEmbed(`Member Count — ${message.guild.name}`,
      `**Total:** ${all.size}\n**Humans:** ${humans}\n**Bots:** ${bots}\n\n🟢 Online: ${online}\n🟡 Idle: ${idle}\n🔴 DND: ${dnd}\n⚫ Offline: ${offline}`
    ).setThumbnail(message.guild.iconURL());
    message.reply({ embeds: [embed] });
  },
};
