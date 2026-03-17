import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  publicId: text("publicId").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  totalExp: integer("totalExp").notNull().default(0),
  currentGp: integer("currentGp").notNull().default(0),
});

export const userStatus = sqliteTable("userStatus", {
  userId: text("userId").notNull().primaryKey().references(() => users.id, { onDelete: "cascade" }),
  logicExp: integer("logicExp").notNull().default(0),
  physicalExp: integer("physicalExp").notNull().default(0),
  mentalExp: integer("mentalExp").notNull().default(0),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const guilds = sqliteTable("guild", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'personal' | 'family' | 'company' | 'friend'
  status: text("status").notNull().default("active"), // 'active' | 'retired'
  points: integer("points").notNull().default(0),
  completedQuests: integer("completedQuests").notNull().default(0),
  usedRewards: integer("usedRewards").notNull().default(0),
  description: text("description"),
  avatar: text("avatar"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const quests = sqliteTable("quest", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  points: integer("points").notNull(), // Legacy/Display points
  category: text("category").notNull().default("logic"), // 'logic' | 'physical' | 'mental'
  rewardExp: integer("rewardExp").notNull().default(0),
  rewardGp: integer("rewardGp").notNull().default(0),
  type: text("type").notNull().default("routine"), // 'routine' | 'target' | 'stage'
  recurrence: text("recurrence"), // e.g., 'daily', 'weekly'
  isCompleted: integer("isCompleted", { mode: "boolean" }).notNull().default(false),
  lastCompleted: text("lastCompleted"), // YYYY-MM-DD
  guildId: integer("guildId")
    .notNull()
    .references(() => guilds.id, { onDelete: "cascade" }),
  parentQuestId: integer("parentQuestId")
    .references((): any => quests.id, { onDelete: "cascade" }),
  completionCount: integer("completion_count").default(0),
});

export const rewards = sqliteTable("reward", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  points: integer("points").notNull(),
  guildId: integer("guildId")
    .notNull()
    .references(() => guilds.id, { onDelete: "cascade" }),
});

export const members = sqliteTable("member", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  guildId: integer("guildId")
    .notNull()
    .references(() => guilds.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  guilds: many(guilds),
  status: one(userStatus, {
    fields: [users.id],
    references: [userStatus.userId],
  }),
}));

export const userStatusRelations = relations(userStatus, ({ one }) => ({
  user: one(users, {
    fields: [userStatus.userId],
    references: [users.id],
  }),
}));

export const guildsRelations = relations(guilds, ({ one, many }) => ({
  user: one(users, {
    fields: [guilds.userId],
    references: [users.id],
  }),
  quests: many(quests),
  rewards: many(rewards),
  members: many(members),
}));

export const questsRelations = relations(quests, ({ one, many }) => ({
  guild: one(guilds, {
    fields: [quests.guildId],
    references: [guilds.id],
  }),
  parentQuest: one(quests, {
    fields: [quests.parentQuestId],
    references: [quests.id],
    relationName: "quest_subQuests"
  }),
  subQuests: many(quests, {
    relationName: "quest_subQuests"
  }),
}));

export const rewardsRelations = relations(rewards, ({ one }) => ({
  guild: one(guilds, {
    fields: [rewards.guildId],
    references: [guilds.id],
  }),
}));

export const membersRelations = relations(members, ({ one }) => ({
  guild: one(guilds, {
    fields: [members.guildId],
    references: [guilds.id],
  }),
}));
