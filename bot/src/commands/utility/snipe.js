import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed, errorEmbed } from "../../utils/embed.js";
import { getSnipe } from "../../events/messageDelete.js";

export default {
  name: "snipe",
  description: "See the last deleted message in this channel",
  category: "utility",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("See the last deleted message in this channel"),
  async execute(interaction, client) {
    const snipe = getSnipe(interaction.channelId);
    if (!snipe) return interaction.reply({ embeds: [errorEmbed("Nothing to Snipe", "No recently deleted messages found.")], ephemeral: true });
    const embed = primaryEmbed("Sniped!", snipe.content)
      .setFooter({ text: `By ${snipe.author}  •  ${new Date(snipe.timestamp).toLocaleTimeString()}  •  SENTRIX` });
    await interaction.reply({ embeds: [embed] });
  },
};
