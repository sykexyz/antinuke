import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";

const reminders = new Map();

function parseTime(str) {
  const units = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  const match = str.match(/^(\d+)(s|m|h|d)$/i);
  if (!match) return null;
  return parseInt(match[1]) * units[match[2].toLowerCase()];
}

export default {
  name: "remind",
  description: "Set a reminder — !remind 30m do the thing",
  category: "social",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!remind <time> <message>`\nTime: `30s`, `10m`, `2h`, `1d`");
    if (args[0] === "list") {
      const mine = reminders.get(message.author.id) || [];
      if (!mine.length) return message.reply({ embeds: [infoEmbed("Your Reminders", "No active reminders.")] });
      const list = mine.map((r, i) => `**${i+1}.** ${r.text} — <t:${Math.floor(r.at/1000)}:R>`).join("\n");
      return message.reply({ embeds: [infoEmbed("Your Reminders", list)] });
    }
    const ms = parseTime(args[0]);
    if (!ms) return message.reply({ embeds: [errorEmbed("Invalid Time", "Use format: `30s`, `10m`, `2h`, `1d`")] });
    if (ms > 86400000 * 7) return message.reply({ embeds: [errorEmbed("Too Long", "Max reminder time is 7 days.")] });
    const text = args.slice(1).join(" ") || "Your reminder!";
    const at = Date.now() + ms;
    const uid = message.author.id;
    if (!reminders.has(uid)) reminders.set(uid, []);
    const entry = { text, at, channelId: message.channel.id };
    reminders.get(uid).push(entry);
    message.reply({ embeds: [successEmbed("Reminder Set ⏰", `I'll remind you: **${text}**\n<t:${Math.floor(at/1000)}:R>`)] });
    setTimeout(async () => {
      const ch = message.client.channels.cache.get(entry.channelId);
      if (ch) ch.send({ embeds: [successEmbed("⏰ Reminder!", `<@${uid}> — **${text}**`)], content: `<@${uid}>` }).catch(() => {});
      const arr = reminders.get(uid) || [];
      const idx = arr.indexOf(entry);
      if (idx > -1) arr.splice(idx, 1);
    }, ms);
  },
};
