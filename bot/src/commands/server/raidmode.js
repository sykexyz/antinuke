import { successEmbed, errorEmbed, infoEmbed } from "../../utils/embed.js";
import { getGuildConfig } from "../../lib/db.js";

const raidServers = new Set();

export default {
  name: "raidmode",
  description: "Toggles raid mode — auto-kicks new joins while active",
  category: "server",
  prefix: true,
  cooldown: 10,
  async execute(message) {
    if (!message.member.permissions.has("ManageGuild")) return message.reply({ embeds: [errorEmbed("No Permission", "You need Manage Server permission.")] });
    const gid = message.guild.id;
    if (raidServers.has(gid)) {
      raidServers.delete(gid);
      message.reply({ embeds: [infoEmbed("Raid Mode OFF", "New members will no longer be auto-kicked.")] });
    } else {
      raidServers.add(gid);
      message.reply({ embeds: [successEmbed("Raid Mode ON 🚨", "All new joins will be auto-kicked until `!raidmode` is run again.")] });
    }
  },
  isRaidMode: (guildId) => raidServers.has(guildId),
};
