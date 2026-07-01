import { infoEmbed, errorEmbed } from "../../utils/embed.js";

export default {
  name: "inviteinfo",
  description: "Shows details about a Discord invite link",
  category: "info",
  prefix: true,
  cooldown: 5,
  async execute(message, args, client) {
    if (!args.length) return message.reply("Usage: `!inviteinfo <invite code or link>`");
    const code = args[0].replace(/https?:\/\/(www\.)?discord\.(gg|com\/invite)\//, "").trim();
    try {
      const invite = await client.fetchInvite(code);
      const embed = infoEmbed(`Invite — ${code}`,
        `**Server:** ${invite.guild?.name || "Unknown"}\n**Channel:** #${invite.channel?.name || "Unknown"}\n**Inviter:** ${invite.inviter?.tag || "Unknown"}\n**Uses:** ${invite.uses ?? "?"} / ${invite.maxUses || "∞"}\n**Expires:** ${invite.expiresAt ? `<t:${Math.floor(invite.expiresAt.getTime()/1000)}:R>` : "Never"}\n**Members:** ${invite.memberCount ?? "?"}`
      ).setThumbnail(invite.guild?.iconURL() || null);
      message.reply({ embeds: [embed] });
    } catch {
      message.reply({ embeds: [errorEmbed("Invalid Invite", "Could not find that invite.")] });
    }
  },
};
