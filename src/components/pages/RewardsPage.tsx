"use client";

import { useGuild } from "@/context/GuildContext";
import Modal from "@/components/common/Modal";
import { useState } from "react";

export default function RewardsPage() {
  const { activeGuild, addReward, claimReward } = useGuild();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [points, setPoints] = useState<number | "">("");

  if (!activeGuild) return null;

  const { state } = activeGuild;

  const handleAddReward = () => {
    if (name.trim() && typeof points === "number" && points > 0) {
      addReward(name, points);
      setName("");
      setPoints("");
      setIsModalOpen(false);
    }
  };

  return (
    <section className="animate-fadeIn pb-10">
      <div className="flex justify-between items-end mb-16 border-b-2 border-[var(--border-color)] pb-3 font-cinzel tracking-widest">
        <h2 className="text-[1.8rem] text-[var(--text-main)] font-bold">
          報酬と免罪符
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={activeGuild.status === 'retired'}
          className={`p-3 px-6 rounded-[var(--radius-md)] font-bold flex items-center gap-2 shadow-md transition-all ${
            activeGuild.status === 'retired'
              ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60"
              : "bg-[var(--primary-color)] text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          <i className="fa-solid fa-plus-circle"></i> 報酬設定
        </button>
      </div>

      <div className="space-y-6">
        {state.rewards.map((reward) => {
          const canAfford = state.points >= reward.points;
          return (
            <div
              key={reward.id}
              className={`bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6 px-8 flex justify-between items-center transition-all duration-400 hover:shadow-[var(--shadow-gentle)] hover:border-[var(--primary-color)]/30 ${
                !canAfford ? "opacity-60 bg-[var(--bg-dark)]/50" : ""
              }`}
            >
              <div>
                <h4 className={`text-[1.25rem] font-bold mb-1 ${!canAfford ? "text-[var(--text-muted)]" : "text-[var(--text-main)]"}`}>{reward.name}</h4>
                <div className={`flex items-center gap-2 font-bold font-cinzel ${canAfford ? "text-[var(--accent-gold)]" : "text-[var(--text-muted)] opacity-60"}`}>
                  <i className="fa-solid fa-gem text-sm opacity-60"></i>
                  <span>消費: {reward.points} pt</span>
                </div>
              </div>
              <button
                onClick={() => claimReward(reward.id)}
                disabled={!canAfford || activeGuild.status === 'retired'}
                className={`p-3 px-8 rounded-full border-2 transition-all font-bold tracking-wider ${
                  canAfford && activeGuild.status !== 'retired'
                    ? "bg-white border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white cursor-pointer shadow-sm active:scale-95"
                    : "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed bg-transparent"
                }`}
              >
                {activeGuild.status === 'retired' ? "交換不可" : "行使する"}
              </button>
            </div>
          );
        })}
        {state.rewards.length === 0 && (
          <div className="text-center py-20 opacity-60 bg-[var(--bg-dark)]/30 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-color)]">
            <i className="fa-solid fa-gifts text-[3.5rem] block mb-4 text-[var(--text-muted)]"></i>
            <p className="italic text-[1.1rem] text-[var(--text-muted)] font-medium">まだ報酬が設定されていません</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="新規報酬を設定"
      >
        <div className="space-y-6">
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              報酬名 (やりたいこと・免罪符)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 高級アイスを食べる、ゲーム三昧"
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="form-group">
            <label className="block text-xs font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              消費ポイント
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="例: 50"
              className="w-full p-4 bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button
            onClick={handleAddReward}
            disabled={activeGuild.status === 'retired'}
            className={`w-full p-4 rounded-[var(--radius-md)] font-bold transition-all shadow-lg hover:brightness-110 active:scale-95 ${
              activeGuild.status === 'retired'
                ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed"
                : "bg-[var(--primary-color)] text-white shadow-xl hover:shadow-2xl"
            }`}
          >
            報酬を追加する
          </button>
        </div>
      </Modal>
    </section>
  );
}
