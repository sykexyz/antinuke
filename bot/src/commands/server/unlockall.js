import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "unlockall",
  description: "Unlocks all text channels",
  category: "server",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    const channels = message.guild.channels.cache.filter(c => c.type === 0);
    const statusMsg = await message.reply(`🔓 Unlocking ${channels.size} channels...`);
    let done = 0;
    for (const [, ch] of channels) {
      try {
        await ch.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
        done++;
      } catch {}
    }
    statusMsg.edit({ embeds: [successEmbed("🔓 Server Unlocked", `Unlocked **${done}** channels.`)], content: null });
  },
};
