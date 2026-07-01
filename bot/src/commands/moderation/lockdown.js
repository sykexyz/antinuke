import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "lockdown",
  description: "Lock all channels (emergency lockdown)",
  usage: "!lockdown [unlock]",
  category: "moderation",
  ownerOnly: true,
  aliases: ["lock"],
  cooldown: 10,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ManageChannels permission.")] });

    const unlock = args[0] === "unlock";
    let count = 0;
    for (const [, channel] of message.guild.channels.cache) {
      if (channel.isTextBased()) {
        await channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: unlock ? null : false }).catch(() => {});
        count++;
      }
    }
    await message.reply({ embeds: [successEmbed(unlock ? "Lockdown Lifted" : "Lockdown Activated", `${unlock ? "Unlocked" : "Locked"} **${count}** channels.`)] });
  },
};
