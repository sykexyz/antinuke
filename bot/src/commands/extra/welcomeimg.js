import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

export default {
  name: "welcomeimg",
  description: "Configure the welcome message and channel",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const sub = args[0]?.toLowerCase();
    const config = await getGuildConfig(message.guild.id);
    if (!sub || sub === "status") {
      return message.reply({ embeds: [infoEmbed("Welcome Config",
        `**Channel:** ${config.welcome_channel ? `<#${config.welcome_channel}>` : "Not set"}\n**Message:** ${config.welcome_message || "Default"}`
      )] });
    }
    if (sub === "channel") {
      const ch = message.mentions.channels.first();
      if (!ch) return message.reply("Usage: `!welcomeimg channel #channel`");
      await query("UPDATE guilds SET welcome_channel = $1 WHERE id = $2", [ch.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Welcome Channel Set", `Welcome messages will be sent in <#${ch.id}>.`)] });
    }
    if (sub === "message") {
      const msg = args.slice(1).join(" ");
      if (!msg) return message.reply("Usage: `!welcomeimg message <text>` — use `{user}` and `{server}` as placeholders.");
      await query("UPDATE guilds SET welcome_message = $1 WHERE id = $2", [msg, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Welcome Message Set", msg.replace("{user}", message.author.username).replace("{server}", message.guild.name))] });
    }
    if (sub === "test") {
      const ch = config.welcome_channel ? message.guild.channels.cache.get(config.welcome_channel) : message.channel;
      const text = (config.welcome_message || "Welcome **{user}** to **{server}**!").replace("{user}", message.author.username).replace("{server}", message.guild.name);
      await ch.send({ embeds: [successEmbed("👋 Welcome!", text).setThumbnail(message.author.displayAvatarURL())] });
      return message.reply("Test welcome message sent!");
    }
    message.reply("Usage: `!welcomeimg status` | `!welcomeimg channel #ch` | `!welcomeimg message <text>` | `!welcomeimg test`");
  },
};
