/**
 * Logic for calculating Level, Rank, and Titles based on EXP
 */

export type UserStats = {
  logicExp: number;
  physicalExp: number;
  mentalExp: number;
  totalExp: number;
};

/**
 * Level = floor(sqrt(totalExp)) + 1
 * e.g. 1 completion = LV 2, 4 = LV 3, 9 = LV 4, 100 = LV 11
 */
export function calculateLevel(totalExp: number): number {
  if (totalExp <= 0) return 1;
  return Math.floor(Math.sqrt(totalExp)) + 1;
}

/**
 * Rank mapping based on totalExp (Completions)
 */
export function calculateRank(totalExp: number): string {
  if (totalExp >= 500) return "S";
  if (totalExp >= 200) return "A";
  if (totalExp >= 100) return "B";
  if (totalExp >= 50) return "C";
  if (totalExp >= 20) return "D";
  if (totalExp >= 5) return "E";
  return "F";
}

/**
 * Dynamic title generation based on EXP ratios
 */
export function generateTitle(stats: UserStats): string {
  const { logicExp, physicalExp, mentalExp, totalExp } = stats;
  
  if (totalExp === 0) return "駆け出しの冒険者";

  const logicRatio = logicExp / totalExp;
  const physicalRatio = physicalExp / totalExp;
  const mentalRatio = mentalExp / totalExp;

  // Combination logic
  if (logicRatio > 0.4 && physicalRatio > 0.4) {
    return "文武両道の賢者";
  }
  
  if (logicRatio > 0.4 && mentalRatio > 0.4) {
    return "心技一体の求道者";
  }

  // Singular logic
  if (logicRatio > 0.6) return "知略の探求者";
  if (physicalRatio > 0.6) return "不屈の鋼鉄兵";
  if (mentalRatio > 0.6) return "運命の観測者";

  if (totalExp > 1000) return "歴戦の旅人";
  
  return "駆け出しの冒険者";
}

/**
 * Calculate EXP needed for next level
 * Based on: Level = sqrt(totalExp) / 10 + 1
 * (Level - 1) * 10 = sqrt(totalExp)
 * ((Level - 1) * 10)^2 = totalExp
 * Next Level totalExp = currentLevel^2
 */
export function getExpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2);
}

export function getRpgProfile(stats: UserStats) {
  const level = calculateLevel(stats.totalExp);
  const rank = calculateRank(stats.totalExp);
  const title = generateTitle(stats);
  const nextLevelExp = getExpForNextLevel(level);
  const progressToNext = stats.totalExp / nextLevelExp;

  return {
    level,
    rank,
    title,
    nextLevelExp,
    progressToNext: Math.min(progressToNext, 1),
  };
}
