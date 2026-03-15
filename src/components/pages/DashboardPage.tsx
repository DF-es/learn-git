"use client";

import { useGuild } from "@/context/GuildContext";
import Card from "@/components/common/Card";
import Modal from "@/components/common/Modal";
import { useState } from "react";

export default function DashboardPage() {
  const { activeGuild, updateDescription, updateAvatar } = useGuild();
  const [isDescModalOpen, setIsDescModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [editDesc, setEditDesc] = useState(activeGuild?.state.description || "");

  if (!activeGuild) return null;

  const { state } = activeGuild;

  const handleSaveDescription = () => {
    updateDescription(editDesc);
    setIsDescModalOpen(false);
  };

  const AVATARS = {
    "人・職業": [
      { icon: "fa-user-astronaut", label: "宇宙飛行士" },
      { icon: "fa-user-ninja", label: "忍者" },
      { icon: "fa-user-tie", label: "ビジネスマン" },
      { icon: "fa-user-graduate", label: "学生/学者" },
      { icon: "fa-user-md", label: "医者" },
      { icon: "fa-user-secret", label: "探偵" },
      { icon: "fa-user-shield", label: "騎士/守護者" },
      { icon: "fa-user-nurse", label: "看護師" },
    ],
    "動物": [
      { icon: "fa-cat", label: "猫" },
      { icon: "fa-dog", label: "犬" },
      { icon: "fa-dragon", label: "ドラゴン" },
      { icon: "fa-frog", label: "カエル" },
      { icon: "fa-hippo", label: "カバ" },
      { icon: "fa-horse", label: "馬" },
      { icon: "fa-fish", label: "魚" },
      { icon: "fa-crow", label: "カラス" },
    ],
  };

  return (
    <section className="space-y-16 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
          <p className="text-[var(--text-main)] italic text-lg leading-relaxed">「{state.description}」</p>
        </Card>

        <Card title="ギルドステータス">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)] font-medium">完了したクエスト</span>
              <span className="text-2xl font-bold text-[var(--primary-color)] font-cinzel">{state.completedQuests}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
              <span className="text-[var(--text-muted)] font-medium">行使した免罪符</span>
              <span className="text-2xl font-bold text-[var(--accent-gold)] font-cinzel">{state.usedRewards}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center mt-20">
        <button
          onClick={() => setIsAvatarModalOpen(true)}
          disabled={activeGuild.status === 'retired'}
          className={`p-5 px-10 rounded-[var(--radius-lg)] shadow-[var(--shadow-gentle)] transition-all flex items-center gap-4 border-2 ${
            activeGuild.status === 'retired'
              ? "bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed opacity-60"
              : "bg-[var(--bg-panel)] border-[var(--border-color)] text-[var(--text-main)] hover:shadow-[var(--shadow-hover)] hover:border-[var(--primary-color)] hover:-translate-y-1 cursor-pointer font-bold"
          }`}
        >
          <i className="fa-solid fa-user-gear text-[var(--primary-color)] text-xl"></i>
          <span>{activeGuild.status === 'retired' ? "アイコン変更不可" : "マスターのアイコンを変更"}</span>
        </button>
      </div>

      {/* Description Modal */}
      <Modal
        isOpen={isDescModalOpen}
        onClose={() => setIsDescModalOpen(false)}
        title="歓迎メッセージの変更"
      >
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-bold text-[var(--text-muted)] mb-3 opacity-80 uppercase tracking-wider">
              メッセージ内容
            </label>
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              rows={5}
              placeholder="ギルドの趣旨や自分へのメッセージを入力してください"
              className="w-full p-5 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all resize-none shadow-inner"
            />
          </div>
          <button
            onClick={handleSaveDescription}
            className="w-full bg-[var(--primary-color)] text-white p-4 rounded-[var(--radius-md)] font-bold shadow-lg hover:brightness-110 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            保存する
          </button>
        </div>
      </Modal>

      {/* Avatar Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="アイコンを選択"
      >
        <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-8 scroll-smooth">
          {Object.entries(AVATARS).map(([category, icons]) => (
            <div key={category}>
              <h4 className="text-[0.85rem] font-bold text-[var(--text-muted)] mb-4 pb-2 border-b-2 border-[var(--bg-dark)] flex items-center gap-2">
                {category === "人・職業" ? <i className="fa-solid fa-user-tag text-[var(--primary-color)]"></i> : <i className="fa-solid fa-paw text-[var(--primary-color)]"></i>}
                {category}
              </h4>
              <div className="grid grid-cols-4 gap-4">
                {icons.map((avatar) => (
                  <div
                    key={avatar.icon}
                    onClick={() => {
                      updateAvatar(avatar.icon);
                      setIsAvatarModalOpen(false);
                    }}
                    className={`aspect-square flex items-center justify-center text-[1.8rem] rounded-[var(--radius-md)] cursor-pointer transition-all ${
                      state.avatar === avatar.icon
                        ? "bg-[rgba(121,163,154,0.15)] border-2 border-[var(--primary-color)] text-[var(--primary-color)] shadow-sm"
                        : "bg-[var(--bg-dark)] border-2 border-transparent text-[var(--text-muted)] hover:bg-white hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:-translate-y-1 hover:shadow-md"
                    }`}
                    title={avatar.label}
                  >
                    <i className={`fa-solid ${avatar.icon}`}></i>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
}
