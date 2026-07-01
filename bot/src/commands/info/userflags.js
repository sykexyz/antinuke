import { infoEmbed, errorEmbed } from "../../utils/embed.js";

const FLAG_LABELS = {
  Staff: "🛡️ Discord Staff",
  Partner: "🤝 Partnered Server Owner",
  Hypesquad: "🏠 HypeSquad Events",
  BugHunterLevel1: "🐛 Bug Hunter Level 1",
  BugHunterLevel2: "🐛 Bug Hunter Level 2",
  HypeSquadOnlineHouse1: "🟠 HypeSquad Bravery",
  HypeSquadOnlineHouse2: "💛 HypeSquad Brilliance",
  HypeSquadOnlineHouse3: "💙 HypeSquad Balance",
  PremiumEarlySupporter: "⭐ Early Supporter",
  VerifiedDeveloper: "🔧 Early Verified Bot Dev",
  CertifiedModerator: "🎓 Certified Moderator",
  ActiveDeveloper: "🔨 Active Developer",
};

export default {
  name: "userflags",
  description: "Shows badge flags on a user's account",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const target = message.mentions.users.first() || message.author;
    const fetched = await target.fetch().catch(() => null);
    if (!fetched) return message.reply({ embeds: [errorEmbed("Error", "Could not fetch user.")] });
    const flags = fetched.flags?.toArray() || [];
    const labels = flags.map(f => FLAG_LABELS[f] || f);
    const embed = infoEmbed(`Flags — ${target.username}`,
      labels.length ? labels.join("\n") : "No public badge flags."
    ).setThumbnail(target.displayAvatarURL());
    message.reply({ embeds: [embed] });
  },
};
