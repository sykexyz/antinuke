import { infoEmbed, errorEmbed } from "../../utils/embed.js";

const ZONES = ["UTC","America/New_York","America/Los_Angeles","America/Chicago","America/Denver","Europe/London","Europe/Paris","Europe/Berlin","Asia/Tokyo","Asia/Manila","Asia/Singapore","Asia/Dubai","Asia/Kolkata","Australia/Sydney","Pacific/Auckland","America/Sao_Paulo","America/Toronto","Asia/Shanghai","Asia/Seoul"];

export default {
  name: "timezone",
  description: "Shows current time in a timezone (or converts between two)",
  category: "conversion",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    if (!args.length) {
      const list = ZONES.map(z => `\`${z}\``).join(", ");
      return message.reply({ embeds: [infoEmbed("Available Timezones", list)] });
    }
    const tz = args[0];
    try {
      const time = new Date().toLocaleString("en-US", { timeZone: tz, dateStyle: "full", timeStyle: "long" });
      message.reply({ embeds: [infoEmbed(`Time in ${tz}`, `🕐 ${time}`)] });
    } catch {
      message.reply({ embeds: [errorEmbed("Invalid Timezone", `\`${tz}\` is not a valid timezone. Use \`!timezone\` to see options.`)] });
    }
  },
};
