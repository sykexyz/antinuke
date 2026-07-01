import { getGuildConfig, query } from "../lib/db.js";
import { EmbedBuilder, AttachmentBuilder } from "discord.js";

export default {
  name: "guildMemberAdd",
  async execute(member, client) {
    const config = await getGuildConfig(member.guild.id);

    // Account age filter
    if (config.account_age_filter > 0) {
      const accountAge = (Date.now() - member.user.createdTimestamp) / (1000 * 60 * 60 * 24);
      if (accountAge < config.account_age_filter) {
        await member.kick(`Account too new (${Math.floor(accountAge)} days old, minimum ${config.account_age_filter}).`);
        return;
      }
    }

    // Anti-raid join rate
    if (config.anti_raid_enabled) {
      const guildId = member.guild.id;
      const tracker = client.antiRaidTracker.get(guildId) || [];
      const now = Date.now();
      const recent = tracker.filter(t => now - t < 10000);
      recent.push(now);
      client.antiRaidTracker.set(guildId, recent);

      if (recent.length >= (config.join_rate_limit || 10)) {
        // Lock all channels
        for (const [, channel] of member.guild.channels.cache) {
          if (channel.isTextBased()) {
            await channel.permissionOverwrites.edit(member.guild.roles.everyone, { SendMessages: false }).catch(() => {});
          }
        }
        const owner = await member.guild.fetchOwner().catch(() => null);
        if (owner) owner.send(`🚨 **RAID DETECTED** on **${member.guild.name}**! All channels locked. Use \`!unlock\` to restore.`).catch(() => {});
        return;
      }
    }

    // Auto join role
    if (config.join_role) {
      const role = member.guild.roles.cache.get(config.join_role);
      if (role) await member.roles.add(role).catch(() => {});
    }

    // Welcome message
    if (config.welcome_channel) {
      const ch = member.guild.channels.cache.get(config.welcome_channel);
      if (ch) {
        const msg = (config.welcome_message || "Welcome **{user}** to **{server}**! You are member **#{count}**.")
          .replace("{user}", member.user.username)
          .replace("{server}", member.guild.name)
          .replace("{count}", member.guild.memberCount);

        const embed = new EmbedBuilder()
          .setColor(0x00ff41)
          .setTitle("Welcome!")
          .setDescription(msg)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        await ch.send({ embeds: [embed] });
      }
    }

    // Welcome DM
    if (config.welcome_dm) {
      const dmMsg = config.welcome_dm
        .replace("{user}", member.user.username)
        .replace("{server}", member.guild.name);
      await member.user.send(dmMsg).catch(() => {});
    }

    // Track member
    await query(
      "INSERT INTO members (user_id, guild_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [member.user.id, member.guild.id]
    );
  },
};
