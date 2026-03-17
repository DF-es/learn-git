export type GuildType = 'personal' | 'family' | 'company' | 'friend';
export type GuildStatus = 'active' | 'retired';
export type ViewMode = 'active' | 'retired';

export interface Reward {
    id: number;
    name: string;
    points: number;
}

export interface Quest {
    id: number;
    name: string;
    points: number;
    type: 'routine' | 'target' | 'stage';
    recurrence?: string | null; // e.g., 'daily', 'weekly'
    isCompleted: boolean;
    lastCompleted?: string | null; // YYYY-MM-DD
    parentQuestId?: number | null;
    completionCount?: number;
    subQuests?: Quest[];
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
    activeTargetQuestId: number | null;
    viewMode: ViewMode;
    guilds: Guild[];
    publicId?: string;
}
