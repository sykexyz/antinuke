import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "lockall",
  description: "Locks all text channels — emergency mode",
  category: "server",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    const reason = args.join(" ") || "Emergency lockdown";
    const channels = message.guild.channels.cache.filter(c => c.type === 0);
    const statusMsg = await message.reply(`🔒 Locking ${channels.size} channels...`);
    let done = 0;
    for (const [, ch] of channels) {
      try {
        await ch.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false }, { reason });
        done++;
      } catch {}
    }
    statusMsg.edit({ embeds: [successEmbed("🔒 Server Locked", `Locked **${done}** channels.\n**Reason:** ${reason}`)], content: null });
  },
};
