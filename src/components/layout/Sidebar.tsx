"use client";

import { useGuild } from "@/context/GuildContext";

export default function Sidebar() {
  const { appData, activeGuild, setActiveSection, setViewMode, setActiveGuild } = useGuild();

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  const handleExit = () => {
    setActiveGuild(null);
  };

  if (!activeGuild) return null;

  return (
    <nav className="w-[320px] bg-[var(--bg-panel)] border-r border-[var(--border-color)] flex flex-col h-full transition-all duration-500 shadow-sm">
      <div className="p-8 text-[1.4rem] text-[var(--primary-color)] flex items-center gap-3 border-b border-[var(--border-color)] font-cinzel font-bold tracking-tight">
        <i className="fa-solid fa-shield-halved"></i>
        <span>{activeGuild.name}</span>
      </div>
      <ul className="list-none p-6 space-y-2 flex-1 outline-none">
        <li
          className={`p-5 px-6 cursor-pointer rounded-[var(--radius-md)] transition-all duration-300 flex items-center gap-4 ${
            appData.activeSection === "dashboard"
              ? "bg-[rgba(121,163,154,0.12)] text-[var(--primary-color)] font-bold shadow-sm"
              : "text-[var(--text-muted)] hover:bg-[rgba(121,163,154,0.05)] hover:text-[var(--primary-color)]"
          }`}
          onClick={() => handleNavClick("dashboard")}
        >
          <i className="fa-solid fa-house w-5"></i>
          <span className="font-medium">ギルド本部</span>
        </li>
        <li
          className={`p-5 px-6 cursor-pointer rounded-[var(--radius-md)] transition-all duration-300 flex items-center gap-4 ${
            appData.activeSection === "quests"
              ? "bg-[rgba(121,163,154,0.12)] text-[var(--primary-color)] font-bold shadow-sm"
              : "text-[var(--text-muted)] hover:bg-[rgba(121,163,154,0.05)] hover:text-[var(--primary-color)]"
          }`}
          onClick={() => handleNavClick("quests")}
        >
          <i className="fa-solid fa-scroll w-5"></i>
          <span className="font-medium">クエスト・ロードマップ</span>
        </li>
        {activeGuild.type !== "personal" && (
          <li
            className={`p-5 px-6 cursor-pointer rounded-[var(--radius-md)] transition-all duration-300 flex items-center gap-4 ${
              appData.activeSection === "members"
                ? "bg-[rgba(121,163,154,0.12)] text-[var(--primary-color)] font-bold shadow-sm"
                : "text-[var(--text-muted)] hover:bg-[rgba(121,163,154,0.05)] hover:text-[var(--primary-color)]"
            }`}
            onClick={() => handleNavClick("members")}
          >
            <i className="fa-solid fa-users w-5"></i>
            <span className="font-medium">メンバー</span>
          </li>
        )}
        <li
          className={`p-5 px-6 cursor-pointer rounded-[var(--radius-md)] transition-all duration-300 flex items-center gap-4 ${
            appData.activeSection === "rewards"
              ? "bg-[rgba(121,163,154,0.12)] text-[var(--primary-color)] font-bold shadow-sm"
              : "text-[var(--text-muted)] hover:bg-[rgba(121,163,154,0.05)] hover:text-[var(--primary-color)]"
          }`}
          onClick={() => handleNavClick("rewards")}
        >
          <i className="fa-solid fa-gem w-5"></i>
          <span className="font-medium">報酬・免罪符</span>
        </li>
      </ul>
      <div className="mt-auto p-6 border-t border-[var(--border-color)] bg-[var(--bg-dark)]/30">
        <button
          className="w-full bg-[var(--bg-panel)] text-[var(--text-muted)] border border-[var(--border-color)] p-3 rounded-[var(--radius-md)] font-bold cursor-pointer transition-all duration-400 flex items-center justify-center gap-2 hover:bg-white hover:text-[var(--accent-red)] hover:border-[var(--accent-red)]/30 hover:shadow-sm"
          onClick={handleExit}
        >
          <i className="fa-solid fa-door-open"></i> ギルド退室
        </button>
      </div>
    </nav>
  );
}
