import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

const categories = ["antinuke", "moderation", "utility", "fun", "leveling", "economy", "roles", "tickets", "config", "owner"];

export default {
  name: "help",
  description: "View all available commands",
  usage: "!help [command|category]",
  category: "utility",
  ownerOnly: false,
  aliases: ["h", "commands"],
  cooldown: 5,
  async execute(message, args, client, config) {
    if (args[0]) {
      const cmd = client.commands.get(args[0].toLowerCase());
      if (cmd) {
        const embed = new EmbedBuilder()
          .setColor(0x00ff41)
          .setTitle(`Command: ${cmd.name}`)
          .setDescription(cmd.description)
          .addFields(
            { name: "Usage", value: `\`${cmd.usage}\``, inline: true },
            { name: "Category", value: cmd.category, inline: true },
            { name: "Cooldown", value: `${cmd.cooldown || 3}s`, inline: true },
            { name: "Aliases", value: cmd.aliases?.join(", ") || "None", inline: true },
            { name: "Owner Only", value: cmd.ownerOnly ? "Yes" : "No", inline: true },
          )
          .setTimestamp();
        return message.reply({ embeds: [embed] });
      }
    }

    const isOwner = message.author.id === message.guild.ownerId;
    const pages = [];

    for (const cat of categories) {
      if ((cat === "owner" || cat === "config" || cat === "antinuke") && !isOwner) continue;
      const cmds = [...client.commands.values()].filter(c => c.category === cat && (!c.ownerOnly || isOwner));
      if (!cmds.length) continue;
      pages.push(new EmbedBuilder()
        .setColor(0x00ff41)
        .setTitle(`Sentrix Bot — ${cat.toUpperCase()}`)
        .setDescription(cmds.map(c => `\`${config.prefix || "!"}${c.name}\` — ${c.description}`).join("\n"))
        .setFooter({ text: `Category ${categories.indexOf(cat) + 1}/${categories.length} | Use !help <command> for details` })
        .setTimestamp()
      );
    }

    if (!pages.length) return message.reply({ embeds: [{ color: 0xff3333, description: "No commands found." }] });

    let page = 0;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("prev").setLabel("◀").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("next").setLabel("▶").setStyle(ButtonStyle.Secondary),
    );

    const msg = await message.reply({ embeds: [pages[0]], components: [row] });
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000, filter: i => i.user.id === message.author.id });
    collector.on("collect", async i => {
      if (i.customId === "prev") page = page > 0 ? page - 1 : pages.length - 1;
      else page = page < pages.length - 1 ? page + 1 : 0;
      await i.update({ embeds: [pages[page]] });
    });
    collector.on("end", () => msg.edit({ components: [] }).catch(() => {}));
  },
};
