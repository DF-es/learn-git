"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, Guild, GuildType, GuildState, ViewMode } from '../types';

interface GuildContextType {
    appData: AppData;
    activeGuild: Guild | null;
    setActiveGuild: (id: number | null) => void;
    setViewMode: (mode: ViewMode) => void;
    setActiveSection: (section: string) => void;
    setActiveQuestTab: (tab: 'quest-board' | 'roadmap-board') => void;
    createGuild: (name: string, type: GuildType) => void;
    retireGuild: (id: number) => void;
    addQuest: (name: string, points: number) => void;
    completeQuest: (id: number) => void;
    addReward: (name: string, points: number) => void;
    claimReward: (id: number) => void;
    addRoadmap: (name: string) => void;
    addStep: (roadmapId: number, name: string) => void;
    addQuestToStep: (roadmapId: number, stepId: number, name: string, points: number) => void;
    completeStepQuest: (roadmapId: number, stepId: number, questId: number) => void;
    updateDescription: (desc: string) => void;
    updateAvatar: (avatar: string) => void;
    addMember: (name: string, role: string) => void;
}

const DEFAULT_GUILD_STATE: GuildState = {
    points: 0,
    completedQuests: 0,
    usedRewards: 0,
    members: [],
    quests: [
        { id: 1, name: "部屋の掃除", points: 20 },
        { id: 2, name: "プログラミング1時間", points: 50 },
        { id: 3, name: "筋トレ", points: 30 }
    ],
    rewards: [
        { id: 1, name: "高級アイスを食べる", points: 50 },
        { id: 2, name: "新作ゲームを買う免罪符", points: 500 },
        { id: 3, name: "罪悪感なく昼寝する", points: 30 }
    ],
    roadmaps: [],
    description: "ここはあなたの欲望を叶え、野望を達成するための秘密のギルドです。日々の善行をポイントに変え、堂々とご褒美を享受しましょう。",
    avatar: "fa-user-astronaut"
};

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: React.ReactNode }) {
    const [appData, setAppData] = useState<AppData>({
        activeGuildId: null,
        activeSection: 'dashboard',
        activeQuestTab: 'quest-board',
        activeMilestone: { roadmapId: null, stepId: null },
        viewMode: 'active',
        guilds: []
    });

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('soloGuildAppData');
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setAppData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load app data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('soloGuildAppData', JSON.stringify(appData));
        }
    }, [appData, isLoaded]);

    const [currentDay, setCurrentDay] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const today = new Date().toISOString().split('T')[0];
            if (today !== currentDay) {
                setCurrentDay(today);
            }
        }, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [currentDay]);

    const activeGuild = appData.guilds.find(g => g.id === appData.activeGuildId) || null;

    const updateAppData = (updater: (prev: AppData) => AppData) => {
        setAppData(prev => updater(prev));
    };

    const updateActiveGuildState = (updater: (prev: GuildState) => GuildState) => {
        if (!appData.activeGuildId) return;
        updateAppData(prev => ({
            ...prev,
            guilds: prev.guilds.map(g => g.id === prev.activeGuildId ? { ...g, state: updater(g.state) } : g)
        }));
    };

    const setActiveGuild = (id: number | null) => updateAppData(prev => ({ ...prev, activeGuildId: id }));
    const setViewMode = (mode: ViewMode) => updateAppData(prev => ({ ...prev, viewMode: mode }));
    const setActiveSection = (section: string) => updateAppData(prev => ({ ...prev, activeSection: section }));
    const setActiveQuestTab = (tab: 'quest-board' | 'roadmap-board') => updateAppData(prev => ({ ...prev, activeQuestTab: tab }));

    const createGuild = (name: string, type: GuildType) => {
        const newGuild: Guild = {
            id: Date.now(),
            name,
            type,
            status: 'active',
            state: JSON.parse(JSON.stringify(DEFAULT_GUILD_STATE))
        };
        updateAppData(prev => ({ ...prev, guilds: [...prev.guilds, newGuild] }));
    };

    const retireGuild = (id: number) => {
        updateAppData(prev => ({
            ...prev,
            guilds: prev.guilds.map(g => g.id === id ? { ...g, status: 'retired' } : g),
            activeGuildId: prev.activeGuildId === id ? null : prev.activeGuildId
        }));
    };

    const addQuest = (name: string, points: number) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            quests: [...state.quests, { id: Date.now(), name, points }]
        }));
    };

    const completeQuest = (id: number) => {
        if (activeGuild?.status === 'retired') return;
        const today = new Date().toISOString().split('T')[0];
        updateActiveGuildState(state => {
            const quest = state.quests.find(q => q.id === id);
            if (quest && quest.lastCompleted !== today) {
                return {
                    ...state,
                    points: state.points + Number(quest.points),
                    completedQuests: state.completedQuests + 1,
                    quests: state.quests.map(q => q.id === id ? { ...q, lastCompleted: today } : q)
                };
            }
            return state;
        });
    };

    const addReward = (name: string, points: number) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            rewards: [...state.rewards, { id: Date.now(), name, points }]
        }));
    };

    const claimReward = (id: number) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => {
            const reward = state.rewards.find(r => r.id === id);
            if (reward && state.points >= reward.points) {
                return {
                    ...state,
                    points: state.points - Number(reward.points),
                    usedRewards: state.usedRewards + 1
                };
            }
            return state;
        });
    };

    const addRoadmap = (name: string) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            roadmaps: [...state.roadmaps, { id: Date.now(), name, steps: [] }]
        }));
    };

    const addStep = (roadmapId: number, name: string) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            roadmaps: state.roadmaps.map(r => r.id === roadmapId ? {
                ...r,
                steps: [...r.steps, { id: Date.now(), name, quests: [] }]
            } : r)
        }));
    };

    const addQuestToStep = (roadmapId: number, stepId: number, name: string, points: number) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            roadmaps: state.roadmaps.map(r => r.id === roadmapId ? {
                ...r,
                steps: r.steps.map(s => s.id === stepId ? {
                    ...s,
                    quests: [...s.quests, { id: Date.now(), name, points, isCompleted: false }]
                } : s)
            } : r)
        }));
    };

    const completeStepQuest = (roadmapId: number, stepId: number, questId: number) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => {
            let pointsToAdd = 0;
            const newRoadmaps = state.roadmaps.map(r => r.id === roadmapId ? {
                ...r,
                steps: r.steps.map(s => s.id === stepId ? {
                    ...s,
                    quests: s.quests.map(q => {
                        if (q.id === questId && !q.isCompleted) {
                            pointsToAdd = Number(q.points);
                            return { ...q, isCompleted: true };
                        }
                        return q;
                    })
                } : s)
            } : r);

            if (pointsToAdd > 0) {
                return {
                    ...state,
                    points: state.points + pointsToAdd,
                    completedQuests: state.completedQuests + 1,
                    roadmaps: newRoadmaps
                };
            }
            return state;
        });
    };

    const updateDescription = (desc: string) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({ ...state, description: desc }));
    };
    const updateAvatar = (avatar: string) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({ ...state, avatar }));
    };
    const addMember = (name: string, role: string) => {
        if (activeGuild?.status === 'retired') return;
        updateActiveGuildState(state => ({
            ...state,
            members: [...state.members, { id: Date.now(), name, role }]
        }));
    };

    return (
        <GuildContext.Provider value={{
            appData, activeGuild, setActiveGuild, setViewMode, setActiveSection, setActiveQuestTab,
            createGuild, retireGuild, addQuest, completeQuest, addReward, claimReward,
            addRoadmap, addStep, addQuestToStep, completeStepQuest,
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
