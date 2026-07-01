import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "password",
  description: "Generates a secure random password",
  category: "generators",
  prefix: true,
  cooldown: 3,
  async execute(message, args) {
    const length = Math.min(Math.max(parseInt(args[0]) || 16, 4), 64);
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}";
    let pwd = "";
    for (let i = 0; i < length; i++) pwd += chars[Math.floor(Math.random() * chars.length)];
    const embed = infoEmbed("Password Generated", `\`\`\`${pwd}\`\`\`\n**Length:** ${length} characters\n*(Keep this safe — SENTRIX does not store passwords)*`);
    try { await message.author.send({ embeds: [embed] }); message.reply("✅ Password sent to your DMs!"); }
    catch { message.reply({ embeds: [embed] }); }
  },
};
