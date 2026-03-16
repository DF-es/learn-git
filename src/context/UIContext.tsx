"use client";

import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
    isAvatarModalOpen: boolean;
    setAvatarModalOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    return (
        <UIContext.Provider value={{ isAvatarModalOpen, setAvatarModalOpen: setIsAvatarModalOpen }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (!context) throw new Error("useUI must be used within a UIProvider");
    return context;
}
