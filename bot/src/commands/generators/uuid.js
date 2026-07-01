import { infoEmbed } from "../../utils/embed.js";
import { randomUUID } from "crypto";

export default {
  name: "uuid",
  description: "Generates a random UUID (v4)",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const count = Math.min(parseInt(args[0]) || 1, 10);
    const ids = Array.from({ length: count }, () => `\`${randomUUID()}\``).join("\n");
    message.reply({ embeds: [infoEmbed("UUID Generator", ids)] });
  },
};
