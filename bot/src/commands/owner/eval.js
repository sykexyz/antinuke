import { EmbedBuilder } from "discord.js";
import { isOwner } from "../../utils/permissions.js";

export default {
  name: "eval",
  description: "Execute code (bot owner only)",
  usage: "!eval <code>",
  category: "owner",
  ownerOnly: true,
  aliases: ["ev"],
  cooldown: 3,
  async execute(message, args, client, config) {
    if (!isOwner(message.author.id))
      return message.reply({ embeds: [{ color: 0xff3333, description: "Bot owner only." }] });

    const code = args.join(" ");
    try {
      let result = eval(code);
      if (result instanceof Promise) result = await result;
      const output = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      const embed = new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle("Eval Output")
        .setDescription(`\`\`\`js\n${output.slice(0, 1900)}\n\`\`\``)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    } catch (err) {
      const embed = new EmbedBuilder()
        .setColor(0xff3333)
        .setTitle("Eval Error")
        .setDescription(`\`\`\`\n${err.message}\n\`\`\``)
        .setTimestamp();
      await message.reply({ embeds: [embed] });
    }
  },
};
