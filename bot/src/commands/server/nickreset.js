import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "nickreset",
  description: "Resets all nicknames in the server",
  category: "server",
  prefix: true,
  cooldown: 30,
  async execute(message) {
    if (!message.member.permissions.has("ManageNicknames")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Nicknames permission.")] });
    await message.guild.members.fetch();
    const withNick = message.guild.members.cache.filter(m => m.nickname && !m.user.bot);
    const statusMsg = await message.reply(`🔄 Resetting ${withNick.size} nicknames...`);
    let done = 0, failed = 0;
    for (const [, member] of withNick) {
      try { await member.setNickname(null); done++; } catch { failed++; }
      await new Promise(r => setTimeout(r, 300));
    }
    statusMsg.edit({ embeds: [successEmbed("Nicknames Reset", `✅ Reset: **${done}**\n❌ Failed: **${failed}**`)], content: null });
  },
};
