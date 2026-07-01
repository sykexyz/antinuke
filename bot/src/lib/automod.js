import { warnEmbed } from "../utils/embed.js";
import { isBypassRole } from "../utils/permissions.js";
import { createCase } from "../lib/db.js";

const spamTracker = new Map();

export default async function autoMod(message, config) {
  if (isBypassRole(message.member, config)) return false;

  // Word filter
  if (config.word_filter && Array.isArray(config.word_filter)) {
    const lower = message.content.toLowerCase();
    for (const word of config.word_filter) {
      if (lower.includes(word.toLowerCase())) {
        await message.delete().catch(() => {});
        await message.channel.send({ embeds: [warnEmbed("Message Removed", `Your message contained a forbidden word.`)] })
          .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
        return true;
      }
    }
  }

  // Caps filter (>70% caps)
  if (config.caps_filter && message.content.length > 10) {
    const caps = message.content.replace(/[^A-Z]/g, "").length;
    const ratio = caps / message.content.replace(/\s/g, "").length;
    if (ratio > 0.7) {
      await message.delete().catch(() => {});
      await message.channel.send({ embeds: [warnEmbed("Caps Spam", "Please do not use excessive capitals.")] })
        .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      return true;
    }
  }

  // Spam filter (5 msgs in 5s)
  if (config.spam_filter) {
    const key = `${message.author.id}-${message.channel.id}`;
    const now = Date.now();
    const tracker = spamTracker.get(key) || [];
    const recent = tracker.filter(t => now - t < 5000);
    recent.push(now);
    spamTracker.set(key, recent);
    if (recent.length >= 5) {
      await message.channel.send({ embeds: [warnEmbed("Spam Detected", `${message.author}, slow down!`)] })
        .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
      await message.member.timeout(60000, "Spam").catch(() => {});
      return true;
    }
  }

  // Invite filter
  if (config.invite_filter && /discord\.gg\/|discord\.com\/invite\//i.test(message.content)) {
    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [warnEmbed("Invite Blocked", "Discord invite links are not allowed here.")] })
      .then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
    return true;
  }

  // Anti-phishing
  const phishDomains = ["grabify.link", "iplogger.org", "steamcornmunity.com", "discorcl.com", "dlscord.com", "freenitroo.com"];
  for (const domain of phishDomains) {
    if (message.content.includes(domain)) {
      await message.delete().catch(() => {});
      await message.channel.send({ embeds: [warnEmbed("Phishing Link Blocked", `A known phishing link was removed from ${message.author}.`)] });
      return true;
    }
  }

  return false;
}
