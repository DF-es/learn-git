"use client";

import { useGuild } from "@/context/GuildContext";
import Modal from "@/components/common/Modal";
import { useState } from "react";

export default function MembersPage() {
  const { activeGuild, addMember } = useGuild();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  if (!activeGuild) return null;

  const handleAddMember = () => {
    if (name.trim()) {
      addMember(name, role);
      setName("");
      setRole("");
      setIsModalOpen(false);
    }
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

        {activeGuild.state.members.map((member) => (
          <div key={member.id} className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-8 flex items-center gap-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="w-16 h-16 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-full flex items-center justify-center text-[1.8rem] text-[var(--text-muted)] opacity-60">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-[1.2rem] font-bold text-[var(--text-main)] mb-1">{member.name}</h4>
              <span className="inline-block bg-[var(--bg-dark)] text-[var(--text-muted)] text-[0.75rem] px-3 py-1 rounded-full font-bold border border-[var(--border-color)]">
                {member.role || "メンバー"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ギルドメンバーを招待"
      >
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              お名前・二つ名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 伝説の冒険者"
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              役職・ジョブ
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="例: フロントエンドの賢者"
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            onClick={handleAddMember}
            className="w-full bg-[var(--primary-color)] text-white p-4 rounded-[var(--radius-md)] font-bold shadow-lg hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            メンバーを追加する
          </button>
        </div>
      </Modal>
    </section>
  );
}
