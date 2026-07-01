import { successEmbed } from "../../utils/embed.js";
import { updateMember } from "../../lib/db.js";

export default {
  name: "afk",
  description: "Set an AFK status that auto-clears when you message",
  usage: "!afk [reason]",
  category: "utility",
  ownerOnly: false,
  aliases: [],
  cooldown: 10,
  async execute(message, args, client, config) {
    const reason = args.join(" ") || "AFK";
    await updateMember(message.author.id, message.guild.id, { afk: reason });
    await message.reply({ embeds: [successEmbed("AFK Set", `You are now AFK: **${reason}**`)] });
  },
};
