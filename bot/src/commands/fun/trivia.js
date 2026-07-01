import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export default {
  name: "trivia",
  description: "Play a trivia question",
  usage: "!trivia",
  category: "fun",
  ownerOnly: false,
  aliases: [],
  cooldown: 10,
  async execute(message, args, client, config) {
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
      const q = res.data.results[0];
      const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      const buttons = allAnswers.map((ans, i) =>
        new ButtonBuilder().setCustomId(`ans_${i}`).setLabel(ans.replace(/&amp;/g, "&").replace(/&quot;/g, '"').slice(0, 80)).setStyle(ButtonStyle.Secondary)
      );
      const row = new ActionRowBuilder().addComponents(buttons);
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Trivia!")
        .setDescription(`**${q.question.replace(/&amp;/g, "&").replace(/&quot;/g, '"')}**\n\nCategory: ${q.category} | Difficulty: ${q.difficulty}`)
        .setTimestamp();
      const msg = await message.reply({ embeds: [embed], components: [row] });
      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });
      collector.on("collect", async i => {
        const chosen = allAnswers[parseInt(i.customId.split("_")[1])];
        const correct = chosen === q.correct_answer;
        await i.update({
          embeds: [new EmbedBuilder().setColor(correct ? 0x00ff41 : 0xff3333).setTitle(correct ? "Correct!" : "Wrong!").setDescription(`The answer was: **${q.correct_answer}**`).setTimestamp()],
          components: []
        });
        collector.stop();
      });
      collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
    } catch {
      await message.reply({ embeds: [{ color: 0xff3333, description: "Could not fetch a trivia question." }] });
    }
  },
};
