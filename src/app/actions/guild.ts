"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { GuildType } from "@/types";
import { revalidatePath } from "next/cache";
import { eq, and, sql, isNull } from "drizzle-orm";

async function ensureUserExists(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });
  
  if (!user) {
    const publicId = `GM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await db.insert(schema.users).values({
      id: userId,
      email: `${userId}@example.com`,
      name: "Default User",
      publicId,
      totalExp: 0,
      currentGp: 0,
    });
  } else if (!user.publicId) {
    const publicId = `GM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    await db.update(schema.users)
      .set({ publicId })
      .where(eq(schema.users.id, userId))
      .run();
  }

  const status = await db.query.userStatus.findFirst({
    where: eq(schema.userStatus.userId, userId),
  });

  if (!status) {
    await db.insert(schema.userStatus).values({
      userId,
      logicExp: 0,
      physicalExp: 0,
      mentalExp: 0,
    });
  }
}

export async function getGuilds(userId: string) {
  await ensureUserExists(userId);
  const userData = await db.query.users.findFirst({
    where: eq(schema.users.id, userId),
  });

  const guilds = await db.query.guilds.findMany({
    where: eq(schema.guilds.userId, userId),
    with: {
      quests: {
        where: isNull(schema.quests.parentQuestId),
        with: {
          subQuests: true,
        },
      },
      rewards: true,
      members: true,
    },
  });

  return { guilds, publicId: userData?.publicId };
}

export async function createGuild(userId: string, name: string, type: GuildType) {
  await ensureUserExists(userId);
  const [guild] = await db.insert(schema.guilds).values({
    name,
    type,
    userId,
    description: "ここはあなたの欲望を叶え、野望を達成するための秘密のギルドです。日々の善行をポイントに変え、堂々とご褒美を享受しましょう。",
    avatar: "fa-user-astronaut",
  }).returning();
  
  revalidatePath("/");
  return guild;
}

export async function updateGuildDetails(id: number, data: any) {
  const [guild] = await db.update(schema.guilds)
    .set(data)
    .where(eq(schema.guilds.id, id))
    .returning();
    
  revalidatePath("/");
  return guild;
}

export async function addQuest(
  guildId: number, 
  name: string, 
  points: number, 
  type: 'routine' | 'target' | 'stage' = 'routine',
  recurrence: string | null = null,
  parentQuestId: number | null = null
) {
  const [quest] = await db.insert(schema.quests).values({
    name,
    points,
    type,
    recurrence,
    guildId,
    parentQuestId,
    category: 'logic', // Keep default but no longer visible in UI
    rewardExp: 0,
    rewardGp: 0,
  }).returning();
  
  revalidatePath("/");
  return quest;
}

import { getRpgProfile } from "@/lib/rpg-logic";

export async function completeQuest(guildId: number, questId: number, type: 'routine' | 'target' | 'stage') {
  const today = new Date().toISOString().split('T')[0];
  
  // Get guild to get userId
  const guild = await db.query.guilds.findFirst({
    where: eq(schema.guilds.id, guildId),
  });

  if (!guild) return null;
  const userId = guild.userId;

  await ensureUserExists(userId);
  
  return await db.transaction((tx) => {
    const questData = tx.select().from(schema.quests).where(eq(schema.quests.id, questId)).get();
    if (!questData) return null;

    const points = questData.points || 0; // Standard points from PT
    const rewardExp = 1; // 1 completion = 1 EXP

    // 1. Update Quest completion state
    if (type === 'routine') {
      tx.update(schema.quests)
        .set({ 
          lastCompleted: today,
          completionCount: sql`completion_count + 1`
        } as any)
        .where(eq(schema.quests.id, questId))
        .run();
    } else {
      tx.update(schema.quests)
        .set({ 
          isCompleted: true,
          completionCount: sql`completion_count + 1`
        } as any)
        .where(eq(schema.quests.id, questId))
        .run();
    }
      
    // 2. Update User GP and Total EXP
    tx.update(schema.users)
      .set({
        currentGp: sql`currentGp + ${points}`,
        totalExp: sql`totalExp + ${rewardExp}`,
      } as any)
      .where(eq(schema.users.id, userId))
      .run();

    // 3. Update Status (Keep as 1 point per category for legacy sync or future-proofing)
    tx.update(schema.userStatus)
      .set({ logicExp: sql`logicExp + 1` } as any)
      .where(eq(schema.userStatus.userId, userId))
      .run();

    // 4. Update Guild (Keep legacy points synced with GP)
    const updatedGuild = tx.update(schema.guilds)
      .set({
        points: sql`points + ${points}`,
        completedQuests: sql`completedQuests + 1`,
      } as any)
      .where(eq(schema.guilds.id, guildId))
      .returning()
      .get();
      
    revalidatePath("/");
    
    // Fetch updated user to return latest status
    const updatedUser = tx.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    const status = tx.select().from(schema.userStatus).where(eq(schema.userStatus.userId, userId)).get();
    
    const rpgProfile = updatedUser && status ? getRpgProfile({
      totalExp: updatedUser.totalExp,
      logicExp: status.logicExp,
      physicalExp: status.physicalExp,
      mentalExp: status.mentalExp,
    }) : null;

    return {
      guild: updatedGuild,
      user: updatedUser,
      rpgProfile
    };
  });
}

export async function addReward(guildId: number, name: string, points: number) {
  const [reward] = await db.insert(schema.rewards).values({
    name,
    points,
    guildId,
  }).returning();
  
  revalidatePath("/");
  return reward;
}

export async function claimReward(guildId: number, rewardId: number, cost: number) {
  const [guild] = await db.update(schema.guilds)
    .set({
      points: sql`points - ${cost}`,
      usedRewards: sql`usedRewards + 1`,
    } as any)
    .where(eq(schema.guilds.id, guildId))
    .returning();
    
  revalidatePath("/");
  return guild;
}

export async function addMember(guildId: number, name: string, role: string = "メンバー") {
  const [member] = await db.insert(schema.members).values({
    name,
    role: role || "メンバー",
    guildId,
  }).returning();
  
  revalidatePath("/");
  return member;
}

export async function findUserByPublicId(query: string) {
  const user = await db.query.users.findFirst({
    where: sql`${schema.users.publicId} = ${query} OR ${schema.users.name} = ${query}`,
  });
  
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    publicId: user.publicId
  };
}

