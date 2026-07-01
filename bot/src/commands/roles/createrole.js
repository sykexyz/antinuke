import { PermissionFlagsBits } from "discord.js";
import { successEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "createrole",
  description: "Create a new role",
  usage: "!createrole <name> [#color]",
  category: "roles",
  ownerOnly: true,
  aliases: ["newrole"],
  cooldown: 10,
  async execute(message, args, client, config) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles))
      return message.reply({ embeds: [errorEmbed("No Permission", "You need ManageRoles permission.")] });

    const color = args.find(a => /^#[0-9a-f]{6}$/i.test(a));
    const name = args.filter(a => a !== color).join(" ");
    if (!name) return message.reply({ embeds: [errorEmbed("No Name", "Provide a role name.")] });

    const role = await message.guild.roles.create({ name, color: color || "#000000", reason: `Created by ${message.author.tag}` });
    await message.reply({ embeds: [successEmbed("Role Created", `Created <@&${role.id}> (${role.id})`)] });
  },
};
