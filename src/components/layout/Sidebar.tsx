"use client";

// Forced refresh: 2026-03-15T22:45
import { useGuild } from "@/context/GuildContext";

export default function Sidebar() {
  const { appData, activeGuild, setActiveSection, setActiveGuild } = useGuild();

  const handleNavClick = (section: string) => {
    setActiveSection(section);
  };

  const handleExit = () => {
    setActiveGuild(null);
  };

  if (!activeGuild) return null;

  return (
    <nav 
      className="bg-[var(--bg-panel)] border-r border-[var(--border-color)] flex flex-col h-full transition-all duration-500 shadow-sm"
      style={{ width: '300px', minWidth: '300px' }}
    >
      <div className="p-8 pl-12 text-[var(--primary-color)] flex items-center gap-6 border-b border-[var(--border-color)] font-bold tracking-tight">
        <i className="fa-solid fa-shield-halved" style={{ fontSize: '2.2rem' }}></i>
        <span style={{ fontSize: '1.5rem', fontWeight: 600 }}>{activeGuild.name}</span>
      </div>
      <ul className="list-none p-0 py-8 pl-10 space-y-4 flex-1 outline-none">
        <li
          className={`cursor-pointer transition-all duration-300 flex items-center gap-5 ${
            appData.activeSection === "dashboard"
              ? "bg-[var(--bg-dark)] text-[var(--primary-color)] font-bold border-r-8 border-[var(--primary-color)] shadow-inner"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/50 hover:text-[var(--primary-color)]"
          }`}
          style={{ padding: '10px 12px', paddingLeft: '32px' }}
          onClick={() => handleNavClick("dashboard")}
        >
          <i className="fa-solid fa-house" style={{ fontSize: '1.6rem', width: '32px', textAlign: 'center' }}></i>
          <span style={{ fontSize: '1.25rem' }} className="font-medium tracking-wider">ギルド本部</span>
        </li>
        <li
          className={`cursor-pointer transition-all duration-300 flex items-center gap-5 ${
            appData.activeSection === "quests"
              ? "bg-[var(--bg-dark)] text-[var(--primary-color)] font-bold border-r-8 border-[var(--primary-color)] shadow-inner"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/50 hover:text-[var(--primary-color)]"
          }`}
          style={{ padding: '10px 12px', paddingLeft: '32px' }}
          onClick={() => handleNavClick("quests")}
        >
          <i className="fa-solid fa-scroll" style={{ fontSize: '1.6rem', width: '32px', textAlign: 'center' }}></i>
          <span style={{ fontSize: '1.25rem' }} className="font-medium tracking-wider">クエスト</span>
        </li>
        {activeGuild.type !== "personal" && (
          <li
            className={`cursor-pointer transition-all duration-300 flex items-center gap-5 ${
              appData.activeSection === "members"
                ? "bg-[var(--bg-dark)] text-[var(--primary-color)] font-bold border-r-8 border-[var(--primary-color)] shadow-inner"
                : "text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/50 hover:text-[var(--primary-color)]"
            }`}
            style={{ padding: '10px 12px', paddingLeft: '32px' }}
            onClick={() => handleNavClick("members")}
          >
            <i className="fa-solid fa-users" style={{ fontSize: '1.6rem', width: '32px', textAlign: 'center' }}></i>
            <span style={{ fontSize: '1.25rem' }} className="font-medium tracking-wider">メンバー</span>
          </li>
        )}
        <li
          className={`cursor-pointer transition-all duration-300 flex items-center gap-5 ${
            appData.activeSection === "rewards"
              ? "bg-[var(--bg-dark)] text-[var(--primary-color)] font-bold border-r-8 border-[var(--primary-color)] shadow-inner"
              : "text-[var(--text-muted)] hover:bg-[var(--bg-dark)]/50 hover:text-[var(--primary-color)]"
          }`}
          style={{ padding: '10px 12px', paddingLeft: '32px' }}
          onClick={() => handleNavClick("rewards")}
        >
          <i className="fa-solid fa-gem" style={{ fontSize: '1.6rem', width: '32px', textAlign: 'center' }}></i>
          <span style={{ fontSize: '1.25rem' }} className="font-medium tracking-wider">報酬・免罪符</span>
        </li>
      </ul>
      <div className="mt-auto p-8 pl-12 border-t border-[var(--border-color)]">
        <button
          className="w-full bg-[var(--bg-dark)] text-[var(--text-main)] border-none p-6 rounded-[var(--radius-md)] text-[1.2rem] font-bold cursor-pointer transition-all duration-400 flex items-center justify-center gap-4 hover:bg-[#ebe9e1]"
          onClick={handleExit}
        >
          <i className="fa-solid fa-door-open text-[1.5rem]"></i> ギルド退室
        </button>
      </div>
    </nav>
  );
}
