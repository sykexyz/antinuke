import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { getMember, query } from "../../lib/db.js";

export default {
  name: "bio",
  description: "Set or clear your profile bio",
  category: "social",
  prefix: true,
  cooldown: 10,
  async execute(message, args) {
    if (!args.length) {
      const member = await getMember(message.author.id, message.guild.id);
      return message.reply({ embeds: [infoEmbed("Your Bio", member.bio || "*No bio set.*")] });
    }
    if (args[0] === "clear") {
      await query("UPDATE members SET bio = NULL WHERE user_id = $1 AND guild_id = $2", [message.author.id, message.guild.id]);
      return message.reply({ embeds: [successEmbed("Bio Cleared", "Your bio has been removed.")] });
    }
    const bio = args.join(" ").slice(0, 200);
    await query("UPDATE members SET bio = $1 WHERE user_id = $2 AND guild_id = $3", [bio, message.author.id, message.guild.id]);
    message.reply({ embeds: [successEmbed("Bio Updated", bio)] });
  },
};
