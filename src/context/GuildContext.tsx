"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Guild, GuildType, ViewMode } from '../types';
import * as actions from '../app/actions/guild';

// Temporary hardcoded user ID until NextAuth is implemented
const TEMP_USER_ID = "temp-user-123";

interface GuildContextType {
    appData: AppData;
    activeGuild: Guild | null;
    isLoading: boolean;
    setActiveGuild: (id: number | null) => void;
    setViewMode: (mode: ViewMode) => void;
    setActiveSection: (section: string) => void;
    setActiveTargetQuestId: (id: number | null) => void;
    createGuild: (name: string, type: GuildType) => Promise<void>;
    retireGuild: (id: number) => Promise<void>;
    addQuest: (
        name: string, 
        points: number, 
        type?: 'routine' | 'target' | 'stage', 
        recurrence?: string | null, 
        parentQuestId?: number | null
    ) => Promise<void>;
    completeQuest: (id: number, type: 'routine' | 'target' | 'stage') => Promise<void>;
    addReward: (name: string, points: number) => Promise<void>;
    claimReward: (id: number) => Promise<void>;
    updateDescription: (desc: string) => Promise<void>;
    updateAvatar: (avatar: string) => Promise<void>;
    addMember: (name: string, role: string) => Promise<void>;
}

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: React.ReactNode }) {
    const [appData, setAppData] = useState<AppData>({
        activeGuildId: null,
        activeSection: 'dashboard',
        activeTargetQuestId: null,
        viewMode: 'active',
        guilds: []
    });

    const [isLoading, setIsLoading] = useState(true);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const { guilds: serverGuilds, publicId } = await actions.getGuilds(TEMP_USER_ID);
            
            const transformedGuilds: Guild[] = serverGuilds.map((g: any) => ({
                id: g.id,
                name: g.name,
                type: g.type as GuildType,
                status: g.status as any,
                state: {
                    points: g.points,
                    completedQuests: g.completedQuests,
                    usedRewards: g.usedRewards,
                    members: g.members,
                    quests: g.quests,
                    rewards: g.rewards,
                    description: g.description || "",
                    avatar: g.avatar || "fa-user-astronaut"
                }
            }));

            setAppData(prev => ({
                ...prev,
                guilds: transformedGuilds,
                publicId: publicId || undefined
            }));
        } catch (e) {
            console.error("Failed to fetch guilds", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const activeGuild = appData.guilds.find(g => g.id === appData.activeGuildId) || null;

    const setActiveGuild = (id: number | null) => setAppData(prev => ({ ...prev, activeGuildId: id }));
    const setViewMode = (mode: ViewMode) => setAppData(prev => ({ ...prev, viewMode: mode }));
    const setActiveSection = (section: string) => setAppData(prev => ({ ...prev, activeSection: section }));
    const setActiveTargetQuestId = (id: number | null) => setAppData(prev => ({ ...prev, activeTargetQuestId: id }));

    const createGuild = async (name: string, type: GuildType) => {
        await actions.createGuild(TEMP_USER_ID, name, type);
        await refreshData();
    };

    const retireGuild = async (id: number) => {
        await actions.updateGuildDetails(id, { status: 'retired' } as any);
        await refreshData();
    };

    const addQuest = async (
        name: string, 
        points: number, 
        type: 'routine' | 'target' | 'stage' = 'routine', 
        recurrence: string | null = null, 
        parentQuestId: number | null = null
    ) => {
        if (!activeGuild) return;
        await actions.addQuest(
            activeGuild.id, name, points, type, recurrence, parentQuestId
        );
        await refreshData();
    };

    const completeQuest = async (id: number, type: 'routine' | 'target' | 'stage') => {
        if (!activeGuild) return;
        await actions.completeQuest(activeGuild.id, id, type);
        await refreshData();
    };

    const addReward = async (name: string, points: number) => {
        if (!activeGuild) return;
        await actions.addReward(activeGuild.id, name, points);
        await refreshData();
    };

    const claimReward = async (id: number) => {
        if (!activeGuild) return;
        const reward = activeGuild.state.rewards.find(r => r.id === id);
        if (reward && activeGuild.state.points >= reward.points) {
            await actions.claimReward(activeGuild.id, id, reward.points);
            await refreshData();
        }
    };


    const updateDescription = async (desc: string) => {
        if (!activeGuild) return;
        await actions.updateGuildDetails(activeGuild.id, { description: desc });
        await refreshData();
    };

    const updateAvatar = async (avatar: string) => {
        if (!activeGuild) return;
        await actions.updateGuildDetails(activeGuild.id, { avatar });
        await refreshData();
    };

    const addMember = async (name: string, role: string) => {
        if (!activeGuild) return;
        await actions.addMember(activeGuild.id, name, role);
        await refreshData();
    };

    return (
        <GuildContext.Provider value={{
            appData, activeGuild, isLoading, setActiveGuild, setViewMode, setActiveSection, setActiveTargetQuestId,
            createGuild, retireGuild, addQuest, completeQuest, addReward, claimReward,
            updateDescription, updateAvatar, addMember
        }}>
            {children}
        </GuildContext.Provider>
    );
}

export function useGuild() {
    const context = useContext(GuildContext);
    if (!context) throw new Error("useGuild must be used within a GuildProvider");
    return context;
}
