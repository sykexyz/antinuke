import { EmbedBuilder } from "discord.js";

export default {
  name: "ping",
  description: "Check bot latency",
  usage: "!ping",
  category: "utility",
  ownerOnly: false,
  aliases: ["latency"],
  cooldown: 3,
  async execute(message, args, client, config) {
    const sent = await message.reply("Pinging...");
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const embed = new EmbedBuilder()
      .setColor(0x00ff41)
      .setTitle("Pong!")
      .addFields(
        { name: "Bot Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${Math.round(client.ws.ping)}ms`, inline: true },
        { name: "Uptime", value: `<t:${Math.floor((Date.now() - client.startTime) / 1000 + Date.now() / 1000)}:R>`, inline: true },
      )
      .setTimestamp();
    await sent.edit({ content: null, embeds: [embed] });
  },
};
