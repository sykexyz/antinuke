import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guildsTable = pgTable("guilds", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  prefix: text("prefix").notNull().default("!"),
  logChannel: text("log_channel"),
  modLogChannel: text("mod_log_channel"),
  welcomeChannel: text("welcome_channel"),
  welcomeMessage: text("welcome_message"),
  leaveChannel: text("leave_channel"),
  leaveMessage: text("leave_message"),
  antiNukeEnabled: boolean("anti_nuke_enabled").notNull().default(true),
  antiNukeThreshold: integer("anti_nuke_threshold").notNull().default(5),
  antiNukeWindow: integer("anti_nuke_window").notNull().default(10),
  antiRaidEnabled: boolean("anti_raid_enabled").notNull().default(true),
  joinRateLimit: integer("join_rate_limit").notNull().default(10),
  accountAgeFilter: integer("account_age_filter").notNull().default(0),
  autoModEnabled: boolean("auto_mod_enabled").notNull().default(false),
  wordFilter: jsonb("word_filter").$type<string[]>().notNull().default([]),
  capsFilter: boolean("caps_filter").notNull().default(false),
  spamFilter: boolean("spam_filter").notNull().default(false),
  inviteFilter: boolean("invite_filter").notNull().default(false),
  xpEnabled: boolean("xp_enabled").notNull().default(true),
  xpRate: integer("xp_rate").notNull().default(15),
  levelUpChannel: text("level_up_channel"),
  joinRole: text("join_role"),
  adminRole: text("admin_role"),
  bypassRoles: jsonb("bypass_roles").$type<string[]>().notNull().default([]),
  trustedBots: jsonb("trusted_bots").$type<string[]>().notNull().default([]),
  language: text("language").notNull().default("en"),
  timezone: text("timezone").notNull().default("UTC"),
  premiumTier: integer("premium_tier").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  guildId: text("guild_id").notNull(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(0),
  coins: integer("coins").notNull().default(0),
  warns: integer("warns").notNull().default(0),
  strikes: integer("strikes").notNull().default(0),
  isMuted: boolean("is_muted").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  afk: text("afk"),
  birthday: text("birthday"),
  inviteCount: integer("invite_count").notNull().default(0),
  invitedBy: text("invited_by"),
  lastDaily: timestamp("last_daily"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").notNull(),
  guildId: text("guild_id").notNull(),
  userId: text("user_id").notNull(),
  moderatorId: text("moderator_id").notNull(),
  action: text("action").notNull(),
  reason: text("reason"),
  duration: integer("duration"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const nukeLogsTable = pgTable("nuke_logs", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  perpetratorId: text("perpetrator_id").notNull(),
  action: text("action").notNull(),
  details: jsonb("details"),
  blocked: boolean("blocked").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const backupsTable = pgTable("backups", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customCommandsTable = pgTable("custom_commands", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  name: text("name").notNull(),
  response: text("response").notNull(),
  ownerOnly: boolean("owner_only").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ticketsTable = pgTable("tickets", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  channelId: text("channel_id").notNull(),
  userId: text("user_id").notNull(),
  claimedBy: text("claimed_by"),
  category: text("category").notNull().default("support"),
  status: text("status").notNull().default("open"),
  transcript: text("transcript"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  closedAt: timestamp("closed_at"),
});

export const giveawaysTable = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  channelId: text("channel_id").notNull(),
  messageId: text("message_id"),
  prize: text("prize").notNull(),
  winnersCount: integer("winners_count").notNull().default(1),
  endAt: timestamp("end_at").notNull(),
  ended: boolean("ended").notNull().default(false),
  participants: jsonb("participants").$type<string[]>().notNull().default([]),
  winners: jsonb("winners").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const economyShopTable = pgTable("economy_shop", {
  id: serial("id").primaryKey(),
  guildId: text("guild_id").notNull(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  description: text("description"),
  roleId: text("role_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userInventoryTable = pgTable("user_inventory", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  guildId: text("guild_id").notNull(),
  itemId: integer("item_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  acquiredAt: timestamp("acquired_at").notNull().defaultNow(),
});

export const botStatsTable = pgTable("bot_stats", {
  id: serial("id").primaryKey(),
  serverCount: integer("server_count").notNull().default(0),
  userCount: integer("user_count").notNull().default(0),
  commandCount: integer("command_count").notNull().default(0),
  recordedAt: timestamp("recorded_at").notNull().defaultNow(),
});

export const insertGuildSchema = createInsertSchema(guildsTable);
export const insertMemberSchema = createInsertSchema(membersTable);
export const insertCaseSchema = createInsertSchema(casesTable);
export const insertTicketSchema = createInsertSchema(ticketsTable);
export const insertGiveawaySchema = createInsertSchema(giveawaysTable);

export type Guild = typeof guildsTable.$inferSelect;
export type InsertGuild = z.infer<typeof insertGuildSchema>;
export type Member = typeof membersTable.$inferSelect;
export type Case = typeof casesTable.$inferSelect;
export type Ticket = typeof ticketsTable.$inferSelect;
export type NukeLog = typeof nukeLogsTable.$inferSelect;
