import { infoEmbed } from "../../utils/embed.js";

export default {
  name: "boostinfo",
  description: "Shows server boost status and boosters",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message) {
    await message.guild.members.fetch();
    const boosters = message.guild.members.cache.filter(m => m.premiumSince).sort((a,b) => a.premiumSince - b.premiumSince);
    const tier = message.guild.premiumTier;
    const count = message.guild.premiumSubscriptionCount || 0;
    const needed = [2,7,14];
    const next = needed.find(n => n > count);
    const boosterList = boosters.size ? boosters.map(m => `<@${m.id}>`).slice(0,10).join("\n") : "No boosters yet.";
    const embed = infoEmbed(`Boost Info — ${message.guild.name}`,
      `**Tier:** ${tier} 🚀\n**Total Boosts:** ${count}\n**Next Tier:** ${next ? `${next - count} more needed` : "Max tier reached!"}\n\n**Top Boosters (${boosters.size}):**\n${boosterList}`
    );
    message.reply({ embeds: [embed] });
  },
};
