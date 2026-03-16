"use client";

// Forced refresh: 2026-03-15T22:45
import { useGuild } from "@/context/GuildContext";
import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import { useState } from "react";
import { useUI } from "@/context/UIContext";

export default function DashboardPage() {
  const { activeGuild, updateDescription } = useGuild();
  const { setAvatarModalOpen } = useUI();
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [editDesc, setEditDesc] = useState(activeGuild?.state.description || "");

  if (!activeGuild) return null;

  const { state } = activeGuild;

  const handleSaveDescription = () => {
    updateDescription(editDesc);
    setIsDescModalOpen(false);
  };

  return (
    <section className="space-y-12 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="歓迎、ギルドマスター"
          headerAction={
            <button
              onClick={() => {
                if (activeGuild.status === 'retired') return;
                setEditDesc(state.description);
                setIsDescModalOpen(true);
              }}
              disabled={activeGuild.status === 'retired'}
              className={`bg-transparent border-none transition-all p-2 rounded-full ${
                activeGuild.status === 'retired' 
                  ? "text-[var(--text-muted)] cursor-not-allowed hidden" 
                  : "text-[var(--text-muted)] cursor-pointer hover:text-[var(--primary-color)] hover:bg-[var(--bg-dark)]"
              }`}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          }
        >
          <p className="text-[var(--text-main)] italic text-xl leading-relaxed py-3">「{state.description}」</p>
        </Card>

        <Card title="ギルドステータス">
          <div className="space-y-8 mt-4">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)] text-[1.1rem]">
              <span className="text-[var(--text-muted)] font-medium">完了したクエスト</span>
              <span className="text-3xl font-bold text-[var(--primary-color)] font-cinzel">{state.completedQuests}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)] text-[1.1rem]">
              <span className="text-[var(--text-muted)] font-medium">行使した免罪符</span>
              <span className="text-3xl font-bold text-[var(--accent-gold)] font-cinzel">{state.usedRewards}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Description Modal */}
      <Modal
        isOpen={isDescModalOpen}
        onClose={() => setIsDescModalOpen(false)}
        title="歓迎メッセージの変更"
      >
        <div className="space-y-12">
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 opacity-80 uppercase tracking-wider">
              メッセージ内容
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={5}
              placeholder="ギルドの趣旨や自分へのメッセージを入力してください"
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all resize-none shadow-inner"
            />
          </div>
          <button
            onClick={handleSaveDescription}
            className="w-full bg-[var(--primary-color)] text-white p-8 text-[1.8rem] rounded-[var(--radius-md)] font-bold shadow-lg hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            保存する
          </button>
        </div>
      </Modal>
    </section>
  );
}
