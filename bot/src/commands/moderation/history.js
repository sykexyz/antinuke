import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { query } from "../../lib/db.js";
import { errorEmbed } from "../../utils/embed.js";

export default {
  name: "history",
  description: "View mod history for a user",
  usage: "!history @user",
  category: "moderation",
  ownerOnly: true,
  aliases: ["cases"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ModerateMembers permission.")] });

    const target = message.mentions.users.first() || client.users.cache.get(args[0]);
    if (!target) return message.reply({ embeds: [errorEmbed("No Target", "Please mention a user.")] });

    const res = await query("SELECT * FROM cases WHERE guild_id = $1 AND user_id = $2 ORDER BY created_at DESC LIMIT 10", [message.guild.id, target.id]);
    if (!res.rows.length) return message.reply({ embeds: [errorEmbed("No Cases", `No mod cases found for ${target.tag}.`)] });

    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle(`Mod History: ${target.tag}`)
      .setDescription(res.rows.map(c => `**Case #${c.case_id}** | ${c.action} | ${c.reason || "No reason"} | <t:${Math.floor(new Date(c.created_at).getTime() / 1000)}:R>`).join("\n"))
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
