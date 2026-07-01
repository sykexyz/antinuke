import { EmbedBuilder } from "discord.js";
import { getSnipe } from "../../events/messageDelete.js";

export default {
  name: "snipe",
  description: "See the last deleted message",
  usage: "!snipe",
  category: "utility",
  ownerOnly: false,
  aliases: [],
  cooldown: 5,
  async execute(message, args, client, config) {
    const snipe = getSnipe(message.channelId);
    if (!snipe) return message.reply({ embeds: [{ color: 0xff3333, description: "Nothing to snipe!" }] });
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle("Sniped!")
      .setDescription(snipe.content)
      .setFooter({ text: `By ${snipe.author} | ${new Date(snipe.timestamp).toLocaleTimeString()}` })
      .setTimestamp();
    await message.reply({ embeds: [embed] });
  },
};
