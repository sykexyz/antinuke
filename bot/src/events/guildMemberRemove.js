import { getGuildConfig } from "../lib/db.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "guildMemberRemove",
  async execute(member, client) {
    const config = await getGuildConfig(member.guild.id);

    if (config.leave_channel) {
      const ch = member.guild.channels.cache.get(config.leave_channel);
      if (ch) {
        const msg = (config.leave_message || "**{user}** has left **{server}**. Members: **{count}**")
          .replace("{user}", member.user.username)
          .replace("{server}", member.guild.name)
          .replace("{count}", member.guild.memberCount);

        const embed = new EmbedBuilder()
          .setColor(0xff3333)
          .setTitle("Goodbye!")
          .setDescription(msg)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        await ch.send({ embeds: [embed] });
      }
    }
  },
};
