import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { getGuildConfig } from "../../lib/db.js";

export default {
  name: "massdm",
  description: "Owner only: DMs all human members a message",
  category: "server",
  prefix: true,
  cooldown: 60,
  async execute(message, args, client) {
    const config = await getGuildConfig(message.guild.id);
    const isStaff = message.author.id === message.guild.ownerId || (config.admin_role && message.member.roles.cache.has(config.admin_role));
    if (!isStaff) return message.reply({ embeds: [errorEmbed("No Permission", "Only the server owner can use this command.")] });
    if (!args.length) return message.reply("Usage: `!massdm <message>`");
    const text = args.join(" ");
    await message.guild.members.fetch();
    const humans = message.guild.members.cache.filter(m => !m.user.bot);
    let sent = 0, failed = 0;
    const statusMsg = await message.reply(`📨 Sending DMs to ${humans.size} members...`);
    for (const [, member] of humans) {
      try { await member.send(`📢 **Message from ${message.guild.name}:**\n\n${text}`); sent++; }
      catch { failed++; }
      await new Promise(r => setTimeout(r, 200));
    }
    statusMsg.edit({ embeds: [successEmbed("Mass DM Complete", `✅ Sent: **${sent}**\n❌ Failed: **${failed}**`)], content: null });
  },
};
