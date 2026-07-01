import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "timestamp",
  description: "Converts a date/time to Discord timestamp format",
  category: "info",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) return message.reply("Usage: `!timestamp <date>` e.g. `!timestamp 2025-12-25` or `!timestamp now`");
    const input = args.join(" ");
    const date = input === "now" ? new Date() : new Date(input);
    if (isNaN(date.getTime())) return message.reply({ embeds: [errorEmbed("Invalid Date", "Could not parse that date. Try `2025-12-25` or `now`.")] });
    const unix = Math.floor(date.getTime() / 1000);
    const embed = infoEmbed("Timestamp Generator",
      `**Input:** \`${input}\`\n\n` +
      `Short Date: <t:${unix}:d> → \`<t:${unix}:d>\`\n` +
      `Long Date: <t:${unix}:D> → \`<t:${unix}:D>\`\n` +
      `Short Time: <t:${unix}:t> → \`<t:${unix}:t>\`\n` +
      `Long Time: <t:${unix}:T> → \`<t:${unix}:T>\`\n` +
      `Relative: <t:${unix}:R> → \`<t:${unix}:R>\`\n` +
      `Full: <t:${unix}:F> → \`<t:${unix}:F>\`\n\n` +
      `**Unix:** \`${unix}\``
    );
    message.reply({ embeds: [embed] });
  },
};
