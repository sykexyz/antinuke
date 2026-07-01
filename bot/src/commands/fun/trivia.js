import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";
import { errorEmbed, COLORS } from "../../utils/embed.js";

export default {
  name: "trivia",
  description: "Play a trivia question",
  category: "fun",
  ownerOnly: false,
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Play a trivia question"),
  async execute(interaction, client) {
    await interaction.deferReply();
    try {
      const { default: axios } = await import("axios");
      const res = await axios.get("https://opentdb.com/api.php?amount=1&type=multiple");
      const q = res.data.results[0];
      const decode = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      const allAnswers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
      const buttons = allAnswers.map((ans, i) =>
        new ButtonBuilder().setCustomId(`trivia_${i}`).setLabel(decode(ans).slice(0, 80)).setStyle(ButtonStyle.Secondary)
      );
      const row = new ActionRowBuilder().addComponents(buttons);
      const embed = new EmbedBuilder()
        .setColor(COLORS.primary)
        .setAuthor({ name: "◆  Trivia Time!" })
        .setDescription(`**${decode(q.question)}**`)
        .addFields(
          { name: "Category", value: q.category, inline: true },
          { name: "Difficulty", value: q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1), inline: true },
        )
        .setFooter({ text: "SENTRIX  •  You have 20 seconds" })
        .setTimestamp();
      await interaction.editReply({ embeds: [embed], components: [row] });
      const msg = await interaction.fetchReply();
      const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 20000 });
      collector.on("collect", async i => {
        const chosen = allAnswers[parseInt(i.customId.split("_")[1])];
        const correct = chosen === q.correct_answer;
        await i.update({
          embeds: [new EmbedBuilder()
            .setColor(correct ? COLORS.success : COLORS.error)
            .setAuthor({ name: correct ? "✦  Correct!" : "✕  Wrong!" })
            .setDescription(`The answer was: **${decode(q.correct_answer)}**`)
            .setFooter({ text: "SENTRIX" })
            .setTimestamp()],
          components: []
        });
        collector.stop();
      });
      collector.on("end", () => interaction.editReply({ components: [] }).catch(() => {}));
    } catch {
      await interaction.editReply({ embeds: [errorEmbed("Error", "Could not fetch a trivia question.")] });
    }
  },
};
