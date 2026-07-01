import { SlashCommandBuilder } from "discord.js";
import { primaryEmbed } from "../../utils/embed.js";

export default {
  name: "ping",
  description: "Check bot latency",
  category: "utility",
  ownerOnly: false,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency"),
  async execute(interaction, client) {
    await interaction.deferReply();
    const latency = Date.now() - interaction.createdTimestamp;
    const embed = primaryEmbed("Pong!", [
      `**◦ Bot Latency** — \`${latency}ms\``,
      `**◦ API Latency** — \`${Math.round(client.ws.ping)}ms\``,
      `**◦ Uptime** — <t:${Math.floor(client.startTime / 1000)}:R>`,
    ].join("\n"));
    await interaction.editReply({ embeds: [embed] });
  },
};
