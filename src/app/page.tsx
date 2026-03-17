"use client";

import { useGuild } from "@/context/GuildContext";
import { GuildProvider } from "@/context/GuildContext";
import { UIProvider } from "@/context/UIContext";
import AppLayout from "@/components/layout/AppLayout";
import GuildSelection from "@/components/layout/GuildSelection";
import DashboardPage from "@/components/pages/DashboardPage";
import QuestsPage from "@/components/pages/QuestsPage";
import MembersPage from "@/components/pages/MembersPage";
import RewardsPage from "@/components/pages/RewardsPage";

function AppContent() {
  const { activeGuild, appData, isLoading } = useGuild();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfaf6] text-[#b49b7e]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <i className="fa-solid fa-scroll text-5xl"></i>
          <p className="font-serif text-xl tracking-widest">LOADING GUILD...</p>
        </div>
      </div>
    );
  }

  if (!activeGuild) {
    return <GuildSelection />;
  }

  const renderSection = () => {
    switch (appData.activeSection) {
      case "dashboard":
        return <DashboardPage />;
      case "quests":
        return <QuestsPage />;
      case "members":
        return <MembersPage />;
      case "rewards":
        return <RewardsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <AppLayout>{renderSection()}</AppLayout>;
}

export default function Home() {
  return (
    <GuildProvider>
      <UIProvider>
        <AppContent />
      </UIProvider>
    </GuildProvider>
  );
}
