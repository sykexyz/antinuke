import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";

const intervals = new Map();

export default {
  name: "statschannels",
  description: "Creates live stat channels showing member count, bot count, etc.",
  category: "extra",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    const sub = args[0]?.toLowerCase();
    if (sub === "stop") {
      const key = message.guild.id;
      if (intervals.has(key)) { clearInterval(intervals.get(key)); intervals.delete(key); }
      return message.reply({ embeds: [successEmbed("Stats Channels Stopped", "Auto-update has been disabled.")] });
    }
    await message.guild.members.fetch();
    const total = message.guild.memberCount;
    const bots = message.guild.members.cache.filter(m => m.user.bot).size;
    const humans = total - bots;
    const category = await message.guild.channels.create({ name: "📊 Server Stats", type: 4 });
    const totalCh = await message.guild.channels.create({ name: `👥 Total: ${total}`, type: 2, parent: category.id, permissionOverwrites: [{ id: message.guild.roles.everyone, deny: ["Connect"] }] });
    const humanCh = await message.guild.channels.create({ name: `🙍 Members: ${humans}`, type: 2, parent: category.id, permissionOverwrites: [{ id: message.guild.roles.everyone, deny: ["Connect"] }] });
    const botCh = await message.guild.channels.create({ name: `🤖 Bots: ${bots}`, type: 2, parent: category.id, permissionOverwrites: [{ id: message.guild.roles.everyone, deny: ["Connect"] }] });
    message.reply({ embeds: [successEmbed("Stats Channels Created", `Category **📊 Server Stats** created with live counters.\nUpdates every 5 minutes.`)] });
    const update = async () => {
      await message.guild.members.fetch().catch(() => {});
      const t = message.guild.memberCount;
      const b = message.guild.members.cache.filter(m => m.user.bot).size;
      const h = t - b;
      totalCh.setName(`👥 Total: ${t}`).catch(() => {});
      humanCh.setName(`🙍 Members: ${h}`).catch(() => {});
      botCh.setName(`🤖 Bots: ${b}`).catch(() => {});
    };
    const iv = setInterval(update, 5 * 60 * 1000);
    intervals.set(message.guild.id, iv);
  },
};
