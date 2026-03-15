"use client";

import { useGuild } from "@/context/GuildContext";
import { GuildType } from "@/types";
import { useState } from "react";
import Modal from "@/components/common/Modal";

export default function GuildSelection() {
  const { appData, createGuild, setActiveGuild, setViewMode, retireGuild } = useGuild();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGuildName, setNewGuildName] = useState("");
  const [newGuildType, setNewGuildType] = useState<GuildType>("personal");

  const GUILD_TYPES_MAP: Record<GuildType, string> = {
    personal: "個人利用",
    family: "家族利用",
    company: "企業利用",
    friend: "友達利用",
  };

  const filteredGuilds = appData.guilds.filter(
    (g) => (g.status || "active") === appData.viewMode
  );

  const handleCreateGuild = () => {
    if (newGuildName.trim()) {
      createGuild(newGuildName, newGuildType);
      setNewGuildName("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className={`fixed inset-0 bg-[var(--bg-dark)] flex flex-col items-center pt-[8vh] z-[2000] overflow-y-auto transition-colors duration-500 ${appData.viewMode === "retired" ? "history-mode" : ""}`}>
      <div className="text-center mb-16 animate-fadeIn">
        <div className="bg-white/50 w-24 h-24 rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--border-color)]">
          <i className="fa-solid fa-shield-cat text-[3.5rem] text-[var(--primary-color)]"></i>
        </div>
        <h1 className="text-[2.8rem] font-cinzel font-bold text-[var(--text-main)] mb-3 tracking-wider">
          {appData.viewMode === "retired" ? "歴史館 - 終了済みギルド" : "所属ギルド選択"}
        </h1>
        <p className="text-[var(--text-muted)] text-[1.2rem] font-medium opacity-80">
          {appData.viewMode === "retired"
            ? "これまでの偉大な歩みを振り返ります"
            : "あなたの冒険を始めるギルドを選んでください"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-[1100px] px-10 pb-32 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        {filteredGuilds.map((guild) => (
          <div
            key={guild.id}
            onClick={() => setActiveGuild(guild.id)}
            className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-10 text-center cursor-pointer transition-all duration-400 hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary-color)]/30 relative overflow-hidden group hover:-translate-y-2"
          >
            <div className={`absolute top-0 right-0 p-2 px-4 text-[0.65rem] rounded-bl-[var(--radius-md)] font-bold uppercase text-white shadow-sm transition-transform group-hover:scale-110 ${guild.type === 'personal' ? 'bg-[var(--primary-color)]' : 'bg-[var(--accent-gold)]'}`}>
              {GUILD_TYPES_MAP[guild.type]}
            </div>
            <div className="w-20 h-20 bg-[var(--bg-dark)] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[var(--border-color)] group-hover:border-[var(--primary-color)] group-hover:scale-110 transition-all text-[2rem] text-[var(--text-muted)] group-hover:text-[var(--primary-color)]">
              <i className={`fa-solid ${guild.state.avatar || 'fa-user-astronaut'}`}></i>
            </div>
            <h3 className="text-[1.5rem] font-cinzel font-bold text-[var(--text-main)] mb-4">
              {guild.name}
            </h3>
            <div className="bg-[var(--bg-dark)]/50 rounded-[var(--radius-md)] p-4 space-y-2 border border-[var(--border-color)]/50">
              <p className="text-[0.85rem] text-[var(--text-muted)] flex justify-between items-center">
                <span>累積ポイント</span>
                <span className="font-cinzel font-bold text-[var(--accent-gold)]">{guild.state.points} pt</span>
              </p>
              <p className="text-[0.85rem] text-[var(--text-muted)] flex justify-between items-center">
                <span>総クリア回数</span>
                <span className="font-cinzel font-bold text-[var(--primary-color)]">{guild.state.completedQuests} 回</span>
              </p>
            </div>
            {appData.viewMode === "active" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("このギルドを引退させますか？（読み取り専用になります）")) retireGuild(guild.id);
                }}
                className="mt-6 text-[0.75rem] font-bold text-[var(--accent-red)] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
              >
                <i className="fa-solid fa-box-archive mr-1"></i> ギルドを引退させる
              </button>
            )}
          </div>
        ))}

        {appData.viewMode === "active" && (
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-[var(--bg-panel)] border-2 border-dashed border-[var(--border-color)] rounded-[var(--radius-lg)] p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-400 hover:bg-[var(--primary-color)]/5 hover:border-[var(--primary-color)] group"
          >
            <div className="w-16 h-16 bg-[var(--bg-dark)] rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-[var(--border-color)] group-hover:border-[var(--primary-color)] transition-all">
              <i className="fa-solid fa-plus text-[1.5rem] text-[var(--text-muted)] group-hover:text-[var(--primary-color)] group-hover:rotate-90 transition-all duration-500"></i>
            </div>
            <h3 className="text-[1.2rem] font-bold text-[var(--text-muted)] group-hover:text-[var(--primary-color)]">新規ギルド設立</h3>
          </div>
        )}
      </div>

      <button
        className={`fixed bottom-10 right-10 p-4 px-8 rounded-full flex items-center gap-3 shadow-xl transition-all z-[2100] font-bold tracking-widest active:scale-95 ${
          appData.viewMode === "active" ? "bg-[var(--text-main)] hover:bg-black" : "bg-[var(--primary-color)] hover:brightness-110"
        } text-white`}
        onClick={() => setViewMode(appData.viewMode === "active" ? "retired" : "active")}
      >
        <i className={`fa-solid ${appData.viewMode === "active" ? "fa-clock-rotate-left" : "fa-person-running"}`}></i>
        <span>{appData.viewMode === "active" ? "歴史館へ（引退済み）" : "活動に戻る"}</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新規ギルド設立"
      >
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">ギルド名</label>
            <input
              type="text"
              value={newGuildName}
              onChange={(e) => setNewGuildName(e.target.value)}
              placeholder="例: 週末リフレッシュギルド"
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">利用目的</label>
            <select
              value={newGuildType}
              onChange={(e) => setNewGuildType(e.target.value as GuildType)}
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner cursor-pointer"
            >
              <option value="personal">個人利用 (Personal)</option>
              <option value="family">家族利用 (Family)</option>
              <option value="company">企業利用 (Company)</option>
              <option value="friend">友達利用 (Friend)</option>
            </select>
          </div>
          <button
            onClick={handleCreateGuild}
            className="w-full bg-[var(--primary-color)] text-white p-4 rounded-[var(--radius-md)] font-bold shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95 transition-all"
          >
            新ギルドを創設する
          </button>
        </div>
      </Modal>
    </div>
  );
}
