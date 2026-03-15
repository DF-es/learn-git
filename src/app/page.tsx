"use client";

import { useGuild } from "@/context/GuildContext";
import { GuildProvider } from "@/context/GuildContext";
import AppLayout from "@/components/layout/AppLayout";
import GuildSelection from "@/components/layout/GuildSelection";
import DashboardPage from "@/components/pages/DashboardPage";
import QuestsPage from "@/components/pages/QuestsPage";
import MembersPage from "@/components/pages/MembersPage";
import RewardsPage from "@/components/pages/RewardsPage";

function AppContent() {
  const { activeGuild, appData } = useGuild();

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
      <AppContent />
    </GuildProvider>
  );
}
