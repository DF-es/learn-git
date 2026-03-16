"use client";

import { useGuild } from "@/context/GuildContext";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import AvatarModal from "@/components/common/AvatarModal";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { activeGuild } = useGuild();

  if (!activeGuild) {
    return <>{children}</>;
  }

  const isRetired = activeGuild.status === "retired";

  return (
    <div className={`flex h-screen overflow-hidden ${isRetired ? "history-mode" : ""}`}>
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-[var(--bg-dark)] transition-colors duration-500 relative">
        {isRetired && (
          <div className="bg-[#5c5c5c] text-white text-center py-2 text-[0.8rem] font-bold tracking-[2px] uppercase z-[110] sticky top-0 border-b border-[#333]">
            <i className="fa-solid fa-clock-rotate-left mr-2"></i> 歴史館 - 閲覧専用モード
          </div>
        )}
        <Topbar />
        <div 
          className="animate-fadeIn"
          style={{ padding: '60px 150px' }}
        >
            {children}
        </div>
        <AvatarModal />
      </main>
    </div>
  );
}
