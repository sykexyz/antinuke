import { successEmbed, errorEmbed } from "../../utils/embed.js";
import { query, getMember } from "../../lib/db.js";

const workMessages = [
  "You worked as a chef and earned", "You delivered packages and earned", "You coded all day and earned",
  "You walked dogs and earned", "You did freelance design and earned", "You streamed and earned",
  "You babysat and earned", "You fixed computers and earned",
];

const workCooldowns = new Map();

export default {
  name: "work",
  description: "Work to earn coins",
  usage: "!work",
  category: "economy",
  ownerOnly: false,
  aliases: [],
  cooldown: 3,
  async execute(message, args, client, config) {
    const key = `${message.author.id}-${message.guild.id}`;
    const last = workCooldowns.get(key) || 0;
    const now = Date.now();
    if (now - last < 3600000) {
      const remaining = Math.ceil((3600000 - (now - last)) / 60000);
      return message.reply({ embeds: [errorEmbed("Already Worked", `You already worked! Come back in **${remaining} minutes**.`)] });
    }
    workCooldowns.set(key, now);
    const amount = Math.floor(Math.random() * 200) + 50;
    await query("UPDATE members SET coins = coins + $1 WHERE user_id = $2 AND guild_id = $3", [amount, message.author.id, message.guild.id]);
    const msg = workMessages[Math.floor(Math.random() * workMessages.length)];
    await message.reply({ embeds: [successEmbed("Work Complete", `${msg} **${amount}** coins!`)] });
  },
};
