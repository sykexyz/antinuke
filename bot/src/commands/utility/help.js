import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

const categories = ["antinuke", "moderation", "utility", "fun", "leveling", "economy", "roles", "tickets", "config", "owner"];

export default {
  name: "help",
  description: "View all available commands",
  category: "utility",
  ownerOnly: false,
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("View all available commands")
    .addStringOption(opt => opt.setName("command").setDescription("Get info on a specific command").setRequired(false)),
  async execute(interaction, client) {
    const cmdName = interaction.options.getString("command");
    const isOwner = interaction.user.id === interaction.guild.ownerId;

    if (cmdName) {
      const cmd = client.commands.get(cmdName.toLowerCase());
      if (cmd) {
        const embed = new EmbedBuilder()
          .setColor(0x7c4dff)
          .setAuthor({ name: `◆  /${cmd.name}` })
          .setDescription(cmd.description)
          .addFields(
            { name: "Category", value: cmd.category, inline: true },
            { name: "Cooldown", value: `${cmd.cooldown || 3}s`, inline: true },
            { name: "Owner Only", value: cmd.ownerOnly ? "Yes" : "No", inline: true },
          )
          .setFooter({ text: "SENTRIX" })
          .setTimestamp();
        return interaction.reply({ embeds: [embed] });
      }
    }

    const pages = [];
    for (const cat of categories) {
      if ((cat === "owner" || cat === "config" || cat === "antinuke") && !isOwner) continue;
      const seen = new Set();
      const cmds = [...client.commands.values()].filter(c => {
        if (c.category !== cat || (c.ownerOnly && !isOwner) || !c.data) return false;
        if (seen.has(c.name)) return false;
        seen.add(c.name);
        return true;
      });
      if (!cmds.length) continue;
      pages.push(new EmbedBuilder()
        .setColor(0x7c4dff)
        .setAuthor({ name: `◆  SENTRIX  —  ${cat.toUpperCase()}` })
        .setDescription(cmds.map(c => `\`/${c.name}\` — ${c.description}`).join("\n"))
        .setFooter({ text: `Category ${categories.indexOf(cat) + 1}/${categories.length}  •  SENTRIX` })
        .setTimestamp()
      );
    }

    if (!pages.length) return interaction.reply({ embeds: [new EmbedBuilder().setColor(0xff1744).setDescription("No commands found.")], ephemeral: true });

    let page = 0;
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("help_prev").setLabel("◀").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("help_next").setLabel("▶").setStyle(ButtonStyle.Secondary),
    );

    await interaction.reply({ embeds: [pages[0]], components: [row] });
    const msg = await interaction.fetchReply();
    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000, filter: i => i.user.id === interaction.user.id });
    collector.on("collect", async i => {
      if (i.customId === "help_prev") page = page > 0 ? page - 1 : pages.length - 1;
      else page = page < pages.length - 1 ? page + 1 : 0;
      await i.update({ embeds: [pages[page]] });
    });
    collector.on("end", () => interaction.editReply({ components: [] }).catch(() => {}));
  },
};
