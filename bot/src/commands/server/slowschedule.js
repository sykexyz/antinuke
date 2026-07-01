import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "slowschedule",
  description: "Auto-sets slowmode after a delay and removes it after a duration",
  category: "server",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageChannels")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Channels permission.")] });
    if (args.length < 2) return message.reply("Usage: `!slowschedule <seconds> <duration_minutes>`\nExample: `!slowschedule 5 10` — sets 5s slowmode for 10 minutes");
    const slow = parseInt(args[0]), dur = parseInt(args[1]);
    if (isNaN(slow)||isNaN(dur)||slow<0||slow>21600||dur<1||dur>1440) return message.reply({ embeds: [errorEmbed("Invalid", "Slowmode: 0–21600s | Duration: 1–1440 minutes.")] });
    await message.channel.setRateLimitPerUser(slow);
    message.reply({ embeds: [successEmbed("Slowmode Scheduled", `Set **${slow}s** slowmode in <#${message.channel.id}>.\nWill be removed in **${dur} minute(s)**.`)] });
    setTimeout(async () => {
      await message.channel.setRateLimitPerUser(0).catch(() => {});
      message.channel.send({ embeds: [successEmbed("Slowmode Removed", `Slowmode has been automatically removed from <#${message.channel.id}>.`)] }).catch(() => {});
    }, dur * 60 * 1000);
  },
};
