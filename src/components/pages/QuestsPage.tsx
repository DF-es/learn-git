"use client";

import { useGuild } from "@/context/GuildContext";
import Modal from "@/components/common/Modal";
import { useState } from "react";

export default function QuestsPage() {
  const { 
    activeGuild, appData, setActiveQuestTab, 
    addQuest, completeQuest,
    addRoadmap, addStep, addQuestToStep, completeStepQuest 
  } = useGuild();

  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState(false);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [isStepDetailModalOpen, setIsStepDetailModalOpen] = useState(false);
  const [isStepQuestModalOpen, setIsStepQuestModalOpen] = useState(false);

  const [questName, setQuestName] = useState("");
  const [questPoints, setQuestPoints] = useState<number | "">("");
  const [roadmapName, setRoadmapName] = useState("");
  const [stepName, setStepName] = useState("");
  const [stepQuestName, setStepQuestName] = useState("");
  const [stepQuestPoints, setStepQuestPoints] = useState<number | "">("");

  const [selectedRoadmapId, setSelectedRoadmapId] = useState<number | null>(null);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [expandedRoadmapIds, setExpandedRoadmapIds] = useState<Set<number>>(new Set());

  const toggleRoadmap = (id: number) => {
    setExpandedRoadmapIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!activeGuild) return null;

  const { state } = activeGuild;
  const today = new Date().toISOString().split("T")[0];

  const handleAddQuest = () => {
    if (questName.trim() && typeof questPoints === "number" && questPoints > 0) {
      addQuest(questName, questPoints);
      setQuestName("");
      setQuestPoints("");
      setIsQuestModalOpen(false);
    }
  };

  const handleAddRoadmap = () => {
    if (roadmapName.trim()) {
      addRoadmap(roadmapName);
      setRoadmapName("");
      setIsRoadmapModalOpen(false);
    }
  };

  const handleAddStep = () => {
    if (stepName.trim() && selectedRoadmapId) {
      addStep(selectedRoadmapId, stepName);
      setStepName("");
      setIsStepModalOpen(false);
    }
  };

  const handleAddStepQuest = () => {
    if (stepQuestName.trim() && typeof stepQuestPoints === "number" && stepQuestPoints > 0 && selectedRoadmapId && selectedStepId) {
      addQuestToStep(selectedRoadmapId, selectedStepId, stepQuestName, stepQuestPoints);
      setStepQuestName("");
      setStepQuestPoints("");
      setIsStepQuestModalOpen(false);
    }
  };

  const selectedRoadmap = activeGuild.state.roadmaps.find(r => r.id === selectedRoadmapId);
  const selectedStep = selectedRoadmap?.steps.find(s => s.id === selectedStepId);

  return (
    <section className="animate-fadeIn pb-10">
      <div className="flex justify-between items-end mb-16 border-b-2 border-[var(--border-color)] pb-1">
        <div className="flex gap-10">
          <button
            onClick={() => setActiveQuestTab("quest-board")}
            className={`bg-transparent border-none border-b-4 p-4 text-[1.6rem] font-bold cursor-pointer transition-all font-cinzel tracking-wide ${
              appData.activeQuestTab === "quest-board"
                ? "text-[var(--text-main)] border-[var(--primary-color)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--primary-color)] opacity-60 hover:opacity-100"
            }`}
          >
            クエスト
          </button>
          <button
            onClick={() => setActiveQuestTab("roadmap-board")}
            className={`bg-transparent border-none border-b-4 p-4 text-[1.6rem] font-bold cursor-pointer transition-all font-cinzel tracking-wide ${
              appData.activeQuestTab === "roadmap-board"
                ? "text-[var(--text-main)] border-[var(--primary-color)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--primary-color)] opacity-60 hover:opacity-100"
            }`}
          >
            ロードマップ
          </button>
        </div>
        <div className="pb-3">
          {appData.activeQuestTab === "quest-board" ? (
            <button
              onClick={() => setIsQuestModalOpen(true)}
              disabled={activeGuild.status === 'retired'}
              style={{ padding: 'var(--btn-action-padding)', fontSize: 'var(--btn-action-font-size)' }}
              className={`rounded-[var(--radius-md)] font-bold flex items-center gap-3 shadow-md transition-all ${
                activeGuild.status === 'retired' 
                  ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60" 
                  : "bg-[var(--primary-color)] text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <i className="fa-solid fa-plus-circle text-lg"></i> クエスト発行
            </button>
          ) : (
            <button
              onClick={() => setIsRoadmapModalOpen(true)}
              disabled={activeGuild.status === 'retired'}
              style={{ padding: 'var(--btn-action-padding)', fontSize: 'var(--btn-action-font-size)' }}
              className={`rounded-[var(--radius-md)] font-bold flex items-center gap-3 shadow-md transition-all ${
                activeGuild.status === 'retired' 
                  ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60" 
                  : "bg-[var(--primary-color)] text-white hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              }`}
            >
              <i className="fa-solid fa-map-marked-alt text-lg"></i> ロードマップ立案
            </button>
          )}
        </div>
      </div>

      {appData.activeQuestTab === "quest-board" ? (
        <div className="space-y-6">
          {state.quests.map((quest) => {
            const isCompletedToday = quest.lastCompleted === today;
            return (
              <div
                key={quest.id}
                style={{ padding: 'var(--card-item-padding-y) var(--card-item-padding-x)' }}
                className={`bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-md)] flex justify-between items-center transition-all duration-400 hover:shadow-[var(--shadow-gentle)] hover:border-[var(--primary-color)]/30 ${
                  isCompletedToday ? "opacity-60 bg-[var(--bg-dark)]/50" : ""
                }`}
              >
                <div>
                  <h4 className={`text-[1.5rem] font-bold mb-2 ${isCompletedToday ? "text-[var(--text-muted)] line-through" : "text-[var(--text-main)]"}`}>
                    {quest.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[var(--primary-color)] font-bold font-cinzel text-[1.2rem]">
                    <i className="fa-solid fa-coins opacity-60"></i>
                    <span>{quest.points} pt</span>
                  </div>
                </div>
                <button
                  onClick={() => completeQuest(quest.id)}
                  disabled={isCompletedToday || activeGuild.status === 'retired'}
                  style={{ padding: '20px 48px', fontSize: '1.25rem' }}
                  className={`rounded-[var(--radius-sm)] border-2 transition-all font-bold tracking-wider ${
                    isCompletedToday || activeGuild.status === 'retired'
                      ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed bg-transparent"
                      : "bg-white border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white cursor-pointer shadow-sm active:scale-95"
                  }`}
                >
                  {isCompletedToday ? "達成済み" : activeGuild.status === 'retired' ? "報告不可" : "達成を報告"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-12">
          {state.roadmaps.map((roadmap) => {
            const totalQuests = roadmap.steps.reduce((acc, s) => acc + s.quests.length, 0);
            const completedQuests = roadmap.steps.reduce((acc, s) => acc + s.quests.filter(q => q.isCompleted).length, 0);
            const progress = totalQuests === 0 ? 0 : Math.round((completedQuests / totalQuests) * 100);

            const isExpanded = expandedRoadmapIds.has(roadmap.id);

            return (
              <div key={roadmap.id} className="bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-lg)] shadow-sm border-t-8 border-t-[var(--primary-color)] overflow-hidden transition-all duration-500">
                <div 
                  onClick={() => toggleRoadmap(roadmap.id)}
                  style={{ padding: 'var(--card-item-padding-y) var(--card-item-padding-x)' }}
                  className="flex justify-between items-center cursor-pointer hover:bg-[var(--bg-dark)]/30 transition-colors"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <h3 className="text-[var(--primary-color)] text-[1.8rem] font-bold font-cinzel tracking-tight">{roadmap.name}</h3>
                    <div className="flex-1 max-w-[300px] mx-8">
                       <div className="bg-[var(--border-color)] rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-[var(--primary-color)] h-full transition-all duration-700 ease-out" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className="block text-[0.9rem] uppercase text-[var(--text-muted)] font-bold tracking-[2px] mb-0.5">進捗</span>
                      <span className="text-[var(--primary-color)] text-[1.8rem] font-bold font-cinzel">{progress}%</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-[var(--text-muted)] text-xl transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}></i>
                  </div>
                </div>

                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                  <div style={{ padding: '0 var(--card-item-padding-x) var(--card-item-padding-y) var(--card-item-padding-x)' }}>
                    <div className="h-px bg-[var(--border-color)] mb-10"></div>
                    <div className="space-y-6 mb-12">
                      {roadmap.steps.map((step) => {
                        const stepTotal = step.quests.length;
                        const stepCompleted = step.quests.filter(q => q.isCompleted).length;
                        const stepProgress = stepTotal === 0 ? 0 : Math.round((stepCompleted / stepTotal) * 100);
                        const isFullyCompleted = stepTotal > 0 && stepCompleted === stepTotal;

                        return (
                          <div 
                            key={step.id} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRoadmapId(roadmap.id);
                              setSelectedStepId(step.id);
                              setIsStepDetailModalOpen(true);
                            }}
                            style={{ padding: 'var(--card-item-padding-y) var(--card-item-padding-x)' }}
                            className={`bg-white border rounded-[var(--radius-md)] flex justify-between items-center cursor-pointer transition-all hover:shadow-sm hover:-translate-y-0.5 border-l-8 ${
                              isFullyCompleted ? "border-l-[var(--accent-green)] border-[var(--border-color)] opacity-70" : "border-l-[var(--border-color)] border-[var(--border-color)]"
                            }`}
                          >
                            <div>
                              <h4 className={`text-[1.1rem] font-bold mb-1 ${isFullyCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"}`}>
                                {step.name}
                              </h4>
                              <span className="text-[0.8rem] text-[var(--text-muted)] font-bold tracking-wide opacity-80 uppercase">
                                {stepCompleted}/{stepTotal} 目標達成 — {stepProgress}%
                              </span>
                            </div>
                            <i className="fa-solid fa-chevron-right text-[var(--text-muted)] opacity-40"></i>
                          </div>
                        );
                      })}
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoadmapId(roadmap.id);
                        setIsStepModalOpen(true);
                      }}
                      disabled={activeGuild.status === 'retired'}
                      className={`w-full bg-white border-2 border-dashed p-6 rounded-[var(--radius-md)] transition-all font-bold ${
                        activeGuild.status === 'retired'
                          ? "border-[var(--text-muted)] text-[var(--text-muted)] cursor-not-allowed opacity-60"
                          : "border-[var(--primary-color)] text-[var(--primary-color)] cursor-pointer hover:bg-[var(--bg-dark)] hover:border-solid active:scale-[0.99]"
                      }`}
                    >
                      <i className="fa-solid fa-plus-circle mr-2 opacity-60"></i> 新しいマイルストーンを追加
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals are updated via the Modal component. Just ensuring input fields inside match the theme */}
      <Modal isOpen={isQuestModalOpen} onClose={() => setIsQuestModalOpen(false)} title="クエストを発行">
        <div className="space-y-12">
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">内容 (タスク・善行)</label>
            <input
              type="text"
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
              placeholder="例: 1時間の勉強、散歩など"
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">獲得ポイント</label>
            <input
              type="number"
              value={questPoints}
              onChange={(e) => setQuestPoints(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="例: 10"
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button onClick={handleAddQuest} className="w-full p-8 text-[1.8rem] rounded-[var(--radius-md)] font-bold bg-[var(--primary-color)] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">クエストを発行</button>
        </div>
      </Modal>

      <Modal isOpen={isRoadmapModalOpen} onClose={() => setIsRoadmapModalOpen(false)} title="長期目標の立案">
        <div className="space-y-12">
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">目標名</label>
            <input
              type="text"
              value={roadmapName}
              onChange={(e) => setRoadmapName(e.target.value)}
              placeholder="例: 資格試験に合格する"
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button onClick={handleAddRoadmap} className="w-full p-8 text-[1.8rem] rounded-[var(--radius-md)] font-bold bg-[var(--primary-color)] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">立案を開始</button>
        </div>
      </Modal>

      <Modal isOpen={isStepModalOpen} onClose={() => setIsStepModalOpen(false)} title="新しいマイルストーン">
        <div className="space-y-12">
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">マイルストーン名</label>
            <input
              type="text"
              value={stepName}
              onChange={(e) => setStepName(e.target.value)}
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button onClick={handleAddStep} className="w-full p-8 text-[1.8rem] rounded-[var(--radius-md)] font-bold bg-[var(--primary-color)] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">追加</button>
        </div>
      </Modal>

      <Modal 
        isOpen={isStepDetailModalOpen} 
        onClose={() => setIsStepDetailModalOpen(false)} 
        title={selectedStep?.name || "マイルストーン詳細"}
      >
        <div className="space-y-12">
          <div className="max-h-[500px] overflow-y-auto space-y-8 pr-6 scroll-smooth">
            {selectedStep?.quests.map((q) => (
              <div key={q.id} className={`bg-white border border-[var(--border-color)] p-8 rounded-[var(--radius-md)] flex justify-between items-center ${q.isCompleted ? "opacity-60" : ""}`}>
                <div>
                  <h4 className={`font-bold text-[1.6rem] mb-3 ${q.isCompleted ? "line-through text-[var(--text-muted)]" : "text-[var(--text-main)]"}`}>{q.name}</h4>
                  <div className="flex items-center gap-2 text-[var(--primary-color)] font-bold text-[1.2rem]">
                    <span>報酬: {q.points} pt</span>
                  </div>
                </div>
                <button 
                  onClick={() => selectedRoadmapId && selectedStepId && completeStepQuest(selectedRoadmapId, selectedStepId, q.id)}
                  disabled={q.isCompleted || activeGuild.status === 'retired'}
                  className={`p-5 px-10 rounded-[var(--radius-sm)] border-2 text-[1.3rem] font-bold transition-all ${
                    q.isCompleted || activeGuild.status === 'retired'
                      ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed"
                      : "bg-white border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)]/5"
                  }`}
                >
                  {q.isCompleted ? "達成" : activeGuild.status === 'retired' ? "報告不可" : "達成"}
                </button>
              </div>
            ))}
            {(!selectedStep || selectedStep.quests.length === 0) && (
              <div className="text-center py-20 opacity-60 bg-[var(--bg-dark)]/30 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--border-color)]">
                  <i className="fa-solid fa-feather text-[4rem] block mb-6 text-[var(--text-muted)]"></i>
                  <p className="italic text-[1.4rem] text-[var(--text-muted)]">まだクエストがありません</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsStepQuestModalOpen(true)}
            disabled={activeGuild.status === 'retired'}
            className={`w-full bg-white border-2 border-dashed p-8 rounded-[var(--radius-md)] flex items-center justify-center gap-4 transition-all font-bold text-[var(--primary-color)] text-[1.6rem] ${
              activeGuild.status === 'retired'
                ? "border-[var(--text-muted)] text-[var(--text-muted)] cursor-not-allowed"
                : "border-[var(--primary-color)] hover:bg-[var(--bg-dark)]/50"
            }`}
          >
            <i className="fa-solid fa-plus opacity-80"></i> クエストを追加
          </button>
        </div>
      </Modal>

      <Modal isOpen={isStepQuestModalOpen} onClose={() => setIsStepQuestModalOpen(false)} title="サブクエスト追加">
        <div className="space-y-12">
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">クエスト名</label>
            <input
              type="text"
              value={stepQuestName}
              onChange={(e) => setStepQuestName(e.target.value)}
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-5 uppercase tracking-widest opacity-80">獲得ポイント</label>
            <input
              type="number"
              value={stepQuestPoints}
              onChange={(e) => setStepQuestPoints(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-8 text-[1.6rem] bg-[var(--bg-dark)] border-2 border-transparent rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>
          <button onClick={handleAddStepQuest} className="w-full p-8 text-[1.8rem] rounded-[var(--radius-md)] font-bold bg-[var(--primary-color)] text-white shadow-lg hover:brightness-110 active:scale-95 transition-all">追加</button>
        </div>
      </Modal>
    </section>
  );
}
