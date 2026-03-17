"use client";

import { useGuild } from "@/context/GuildContext";
import Modal from "@/components/common/Modal";
import { useState, useOptimistic, useTransition } from "react";
import { Member } from "@/types";
import * as actions from "@/app/actions/guild";

export default function MembersPage() {
  const { activeGuild, addMember } = useGuild();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStatus, setSearchStatus] = useState<'idle' | 'searching' | 'found' | 'not_found'>('idle');
  const [foundUser, setFoundUser] = useState<{name: string} | null>(null);

  // Optimistic Members
  const [optimisticMembers, addOptimisticMember] = useOptimistic(
    activeGuild?.state.members || [],
    (state: Member[], newMember: Member) => [...state, newMember]
  );

  if (!activeGuild) return null;

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchStatus('searching');
    
    try {
      const user = await actions.findUserByPublicId(searchQuery.trim());
      if (user) {
        setFoundUser({ name: user.name || "名無しの冒険者" });
        setSearchStatus('found');
        setName(user.name || "名無しの冒険者");
      } else {
        setSearchStatus('not_found');
        setFoundUser(null);
      }
    } catch (e) {
      console.error("Search failed", e);
      setSearchStatus('not_found');
    }
  };

  const handleAddMember = async () => {
    if (!name.trim()) return;

    const newMember: Member = {
      id: Math.random(), // Temporary ID for optimistic UI
      name: name,
      role: "メンバー"
    };

    startTransition(async () => {
      addOptimisticMember(newMember);
      await addMember(name, "メンバー");
    });

    setName("");
    setSearchQuery("");
    setSearchStatus('idle');
    setFoundUser(null);
    setIsModalOpen(false);
  };

  return (
    <section className="animate-fadeIn pb-10">
      <div className="flex justify-between items-end mb-16 border-b-2 border-[var(--border-color)] pb-3 font-cinzel tracking-widest">
        <h2 className="text-[1.8rem] text-[var(--text-main)] font-bold">
          <i className="fa-solid fa-users-viewfinder mr-4 opacity-70"></i> ギルドメンバー
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={activeGuild.status === 'retired'}
          className={`p-3 px-6 rounded-[var(--radius-md)] font-bold flex items-center gap-2 shadow-md transition-all ${
            activeGuild.status === 'retired'
              ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60"
              : "bg-[var(--primary-color)] text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          <i className="fa-solid fa-user-plus"></i> メンバー招待
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Virtual Master Card */}
        <div className="bg-white border-2 border-[var(--primary-color)] rounded-[var(--radius-lg)] p-8 flex items-center gap-6 shadow-md transition-all hover:shadow-xl hover:-translate-y-1 group">
          <div className="relative w-16 h-16 bg-[var(--bg-dark)] border-2 border-[var(--primary-color)]/20 rounded-full flex items-center justify-center text-[1.8rem] text-[var(--primary-color)] group-hover:scale-110 transition-transform">
            <i className={`fa-solid ${activeGuild.state.avatar || 'fa-user-astronaut'}`}></i>
            <div className="absolute -bottom-1 -right-1 bg-[var(--primary-color)] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <i className="fa-solid fa-crown"></i>
            </div>
          </div>
          <div className="flex-1">
            <span className="block text-[0.65rem] font-bold text-[var(--primary-color)] uppercase tracking-wider mb-1">Guild Founder</span>
            <h4 className="text-[1.2rem] font-bold font-cinzel text-[var(--text-main)]">ギルドマスター</h4>
          </div>
        </div>

        {optimisticMembers.map((member) => (
          <div key={member.id} className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-8 flex items-center gap-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[1.8rem] text-[var(--text-muted)] opacity-60">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-[1.2rem] font-bold text-[var(--text-main)] mb-1">{member.name}</h4>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSearchQuery("");
          setSearchStatus('idle');
          setFoundUser(null);
        }}
        title="ギルドメンバーを招待"
      >
        <div className="space-y-8">
          {/* Search Section */}
          <div className="bg-[var(--bg-dark)]/50 p-6 rounded-[var(--radius-md)] border border-[var(--border-color)]">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              IDまたは名前で探す
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="例: GM-A1B2C または 冒険者名"
                className="flex-1 p-4 bg-white border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] transition-all shadow-sm"
              />
              <button
                onClick={handleSearch}
                disabled={searchStatus === 'searching'}
                className="bg-[var(--bg-dark)] text-[var(--text-main)] px-5 rounded-[var(--radius-md)] font-bold hover:bg-[var(--border-color)] transition-all flex items-center justify-center min-w-[80px]"
              >
                {searchStatus === 'searching' ? <i className="fa-solid fa-spinner fa-spin"></i> : "検索"}
              </button>
            </div>
            {searchStatus === 'found' && (
              <p className="mt-3 text-sm text-[var(--success-color)] font-bold flex items-center gap-2 animate-fadeIn">
                <i className="fa-solid fa-check-circle"></i> 冒険者「{foundUser?.name}」が見つかりました！
              </p>
            )}
            {searchStatus === 'not_found' && (
              <p className="mt-3 text-sm text-[var(--error-color)] font-bold flex items-center gap-2 animate-fadeIn">
                <i className="fa-solid fa-exclamation-triangle"></i> その冒険者は見つかりませんでした。
              </p>
            )}
          </div>

          <div className="relative py-2 flex items-center">
            <div className="flex-grow border-t border-[var(--border-color)]"></div>
            <span className="flex-shrink mx-4 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest opacity-50">または直接入力</span>
            <div className="flex-grow border-t border-[var(--border-color)]"></div>
          </div>

          <div className="space-y-6">
            <div className="form-group">
              <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
                招待するお名前
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: 伝説の冒険者"
                className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
              />
            </div>
            <button
              onClick={handleAddMember}
              className="w-full bg-[var(--primary-color)] text-white p-4 rounded-[var(--radius-md)] font-bold shadow-lg hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              {searchStatus === 'found' ? '見つかった冒険者を招待する' : 'メンバーを追加する'}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
