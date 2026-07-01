import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { isOwner } from "../../utils/permissions.js";
import { COLORS } from "../../utils/embed.js";

export default {
  name: "eval",
  description: "Execute JavaScript code (bot owner only)",
  category: "owner",
  ownerOnly: true,
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Execute JavaScript code (bot owner only)")
    .addStringOption(opt => opt.setName("code").setDescription("Code to evaluate").setRequired(true)),
  async execute(interaction, client) {
    if (!isOwner(interaction.user.id))
      return interaction.reply({ embeds: [new EmbedBuilder().setColor(COLORS.error).setDescription("Bot owner only.")], ephemeral: true });

    const code = interaction.options.getString("code");
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      const output = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.success)
          .setAuthor({ name: "✦  Eval Output" })
          .setDescription(`\`\`\`js\n${output.slice(0, 1900)}\n\`\`\``)
          .setFooter({ text: "SENTRIX" })
          .setTimestamp()],
        ephemeral: true
      });
    } catch (err) {
      await interaction.reply({
        embeds: [new EmbedBuilder()
          .setColor(COLORS.error)
          .setAuthor({ name: "✕  Eval Error" })
          .setDescription(`\`\`\`\n${err.message}\n\`\`\``)
          .setFooter({ text: "SENTRIX" })
          .setTimestamp()],
        ephemeral: true
      });
    }
  },
};
