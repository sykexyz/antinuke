import { successEmbed, errorEmbed, infoEmbed, primaryEmbed } from "../../utils/embed.js";
import { query, getGuildConfig } from "../../lib/db.js";

const pending = new Map();

export default {
  name: "verify",
  description: "Set up or go through server verification",
  category: "extra",
  prefix: true,
  cooldown: 5,
  async execute(message, args) {
    const sub = args[0]?.toLowerCase();
    if (sub === "setup") {
      if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
      if (args.length < 3) return message.reply("Usage: `!verify setup @role <question>`\nExample: `!verify setup @Verified What is 2+2?`");
      const role = message.mentions.roles.first();
      const question = args.slice(2).join(" ");
      if (!role || !question) return message.reply("Need a role mention and a question.");
      await query("UPDATE guilds SET join_role = $1, welcome_message = $2 WHERE id = $3", [role.id, `VERIFY:${question}`, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Verification Setup", `Role: **${role.name}**\nQuestion: *${question}*\n\nMembers can run \`!verify\` to get verified.`)] });
    }
    const config = await getGuildConfig(message.guild.id);
    const verifyData = config.welcome_message?.startsWith("VERIFY:") ? config.welcome_message.slice(7) : null;
    if (!verifyData) return message.reply({ embeds: [infoEmbed("Verification", "No verification is set up for this server.")] });
    if (!sub) {
      const q = verifyData;
      await message.reply({ embeds: [primaryEmbed("Server Verification", `Please answer this question in your next message:\n\n**${q}**`)] });
      pending.set(message.author.id, { guildId: message.guild.id, q });
      return;
    }
  },
  pending,
};
