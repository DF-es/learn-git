export type GuildType = 'personal' | 'family' | 'company' | 'friend';
export type GuildStatus = 'active' | 'retired';
export type ViewMode = 'active' | 'retired';

export interface Quest {
    id: number;
    name: string;
    points: number;
    lastCompleted?: string; // YYYY-MM-DD
}

export interface Reward {
    id: number;
    name: string;
    points: number;
}

export interface StepQuest {
    id: number;
    name: string;
    points: number;
    isCompleted: boolean;
}

export interface RoadmapStep {
    id: number;
    name: string;
    quests: StepQuest[];
}

export interface Roadmap {
    id: number;
    name: string;
    steps: RoadmapStep[];
}

export interface Member {
    id: number;
    name: string;
    role: string;
}

export interface GuildState {
    points: number;
    completedQuests: number;
    usedRewards: number;
    members: Member[];
    quests: Quest[];
    rewards: Reward[];
    roadmaps: Roadmap[];
    description: string;
    avatar: string;
}

export interface Guild {
    id: number;
    name: string;
    type: GuildType;
    status: GuildStatus;
    state: GuildState;
}

export interface AppData {
    activeGuildId: number | null;
    activeSection: string;
    activeQuestTab: 'quest-board' | 'roadmap-board';
    activeMilestone: { roadmapId: number | null; stepId: number | null };
    viewMode: ViewMode;
    guilds: Guild[];
}
