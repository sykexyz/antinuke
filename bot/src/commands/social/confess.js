import { successEmbed, errorEmbed, primaryEmbed } from "../../utils/embed.js";
import { query } from "../../lib/db.js";

export default {
  name: "confess",
  description: "Send an anonymous confession to the configured confession channel",
  category: "social",
  prefix: true,
  cooldown: 30,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!confess <your message>`\nThis will be posted anonymously.");
    await message.delete().catch(() => {});
    const res = await query("SELECT confession_channel FROM guilds WHERE id = $1", [message.guild.id]);
    const channelId = res.rows[0]?.confession_channel;
    if (!channelId) return message.author.send({ embeds: [errorEmbed("Not Configured", "This server has no confession channel set up. Ask an admin to use `!confessionchannel #channel`.")] }).catch(() => {});
    const ch = message.guild.channels.cache.get(channelId);
    if (!ch) return;
    const text = args.join(" ").slice(0, 500);
    await ch.send({ embeds: [primaryEmbed("💬 Anonymous Confession", text).setFooter({ text: "SENTRIX • Anonymous" })] });
    message.author.send({ embeds: [successEmbed("Confession Sent", "Your confession was posted anonymously.")] }).catch(() => {});
  },
};
