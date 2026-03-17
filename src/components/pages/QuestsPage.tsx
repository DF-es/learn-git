"use client";

import { useGuild } from "@/context/GuildContext";
import Modal from "@/components/common/Modal";
import { useState } from "react";

export default function QuestsPage() {
  const { 
    activeGuild, appData, setActiveTargetQuestId, 
    addQuest, completeQuest
  } = useGuild();

  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  const [questFormType, setQuestFormType] = useState<'routine' | 'target'>('routine');
  const [questName, setQuestName] = useState("");
  const [questPoints, setQuestPoints] = useState<number | "">("");
  const [questRecurrence, setQuestRecurrence] = useState("daily");

  const [isSubQuestModalOpen, setIsSubQuestModalOpen] = useState(false);
  const [subQuestFormType, setSubQuestFormType] = useState<'routine' | 'stage'>('stage');
  const [subQuestName, setSubQuestName] = useState("");
  const [subQuestPoints, setSubQuestPoints] = useState<number | "">("");
  const [subQuestRecurrence, setSubQuestRecurrence] = useState("daily");
  const [roadmapTab, setRoadmapTab] = useState<'stages' | 'routines'>('stages');

  if (!activeGuild) return null;

  const { state } = activeGuild;
  const today = new Date().toISOString().split("T")[0];

  const handleAddQuest = () => {
    if (questName.trim() && typeof questPoints === "number" && questPoints > 0) {
      addQuest(
        questName, 
        questPoints, 
        questFormType, 
        questFormType === 'routine' ? questRecurrence : null, 
        null
      );
      setQuestName("");
      setQuestPoints("");
      setIsQuestModalOpen(false);
    }
  };

  const handleAddSubQuest = () => {
    if (subQuestName.trim() && typeof subQuestPoints === "number" && subQuestPoints > 0 && appData.activeTargetQuestId) {
      addQuest(
        subQuestName, 
        subQuestPoints, 
        subQuestFormType, 
        subQuestFormType === 'routine' ? subQuestRecurrence : null, 
        appData.activeTargetQuestId
      );
      setSubQuestName("");
      setSubQuestPoints("");
      setIsSubQuestModalOpen(false);
    }
  };

  const renderTopLevelQuests = () => {
    const topLevelQuests = state.quests.filter(q => !q.parentQuestId);
    return (
      <section className="animate-fadeIn pb-10">
        <div className="flex justify-between items-end mb-16 border-b-2 border-[var(--border-color)] pb-3 mt-10">
          <h2 className="text-[1.8rem] font-bold font-cinzel text-[var(--accent-gold)] tracking-widest pl-2">
            アクティブクエスト
          </h2>
          <button
            onClick={() => setIsQuestModalOpen(true)}
            disabled={activeGuild.status === 'retired'}
            style={{ padding: 'var(--btn-action-padding)', fontSize: 'var(--btn-action-font-size)' }}
            className={`rounded-[var(--radius-md)] font-bold flex items-center gap-3 shadow-md transition-all ${
              activeGuild.status === 'retired' 
                ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60" 
                : "bg-[var(--accent-gold)] text-[var(--bg-dark)] hover:brightness-110 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            <i className="fa-solid fa-plus text-lg"></i> クエスト発行
          </button>
        </div>

        <div className="space-y-6">
          {topLevelQuests.map((quest) => {
            const isCompletedToday = quest.type === 'routine' ? quest.lastCompleted === today : quest.isCompleted;
            return (
              <div
                key={quest.id}
                style={{ padding: 'var(--card-item-padding-y) var(--card-item-padding-x)' }}
                className={`bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-md)] flex justify-between items-center transition-all duration-400 hover:shadow-[var(--shadow-gentle)] hover:border-[var(--accent-gold)]/30 border-l-8 ${
                  quest.type === 'target' ? 'border-l-[var(--primary-color)]' : 'border-l-[var(--accent-green)]'
                } ${isCompletedToday ? "opacity-60 bg-[var(--bg-dark)]/50 border-l-[var(--text-muted)]" : ""}`}
              >
                <div className="flex-1">
                  <h4 className={`text-[1.5rem] font-bold mb-3 ${isCompletedToday ? "text-[var(--text-muted)] line-through" : "text-[var(--text-main)]"}`}>
                    {quest.name}
                  </h4>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-[var(--accent-gold)] font-bold font-cinzel text-[1.2rem]">
                      <i className="fa-solid fa-coins opacity-80"></i>
                      <span>+{quest.points}</span>
                    </div>
                    {quest.type === 'routine' && (
                      <span className="text-[0.9rem] font-bold text-[var(--text-muted)] bg-[var(--bg-dark)] border border-[var(--border-color)] px-3 py-1 rounded-full uppercase tracking-widest">
                        <i className="fa-solid fa-clock mr-1"></i> {quest.recurrence === 'daily' ? '1日' : '1週間'}
                      </span>
                    )}
                    {quest.type === 'target' && (
                      <button 
                        onClick={() => setActiveTargetQuestId(quest.id)}
                        className="text-[0.9rem] font-bold text-[var(--text-main)] border border-[var(--text-muted)] px-4 py-1.5 rounded-full hover:bg-[var(--text-main)] hover:text-[var(--bg-dark)] transition-colors opacity-80 hover:opacity-100"
                      >
                        <i className="fa-solid fa-map mr-1"></i> ロードマップを開く
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => completeQuest(quest.id, quest.type)}
                  disabled={isCompletedToday || activeGuild.status === 'retired'}
                  style={{ padding: '16px 40px', fontSize: '1.25rem' }}
                  className={`rounded-[var(--radius-sm)] border transition-all font-bold tracking-wider ml-6 flex items-center gap-2 ${
                    isCompletedToday || activeGuild.status === 'retired'
                      ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed bg-transparent"
                      : "bg-transparent border-[var(--accent-green)] text-[var(--accent-green)] hover:bg-[var(--accent-green)]/10 cursor-pointer shadow-sm active:scale-95"
                  }`}
                >
                  <i className="fa-solid fa-check"></i>
                  {isCompletedToday ? "達成" : "達成"}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  const renderRoadmapView = () => {
    const targetQuest = state.quests.find(q => q.id === appData.activeTargetQuestId);
    if (!targetQuest) return null;
    const allSubQuests = targetQuest.subQuests || [];
    
    // Filter based on tab
    const subQuests = allSubQuests.filter(q => 
      roadmapTab === 'stages' ? q.type === 'stage' : q.type === 'routine'
    );

    return (
      <section className="animate-fadeIn pb-10">
        <div className="flex justify-between items-center mb-12 mt-6">
          <button 
            onClick={() => setActiveTargetQuestId(null)}
            className="flex items-center gap-2 text-[1.1rem] font-bold text-[var(--text-main)] hover:text-[var(--primary-color)] transition-all border border-[var(--border-color)] px-10 py-3.5 rounded-full hover:bg-[var(--bg-panel)] bg-white shadow-sm"
          >
            <i className="fa-solid fa-arrow-left"></i> 戻る
          </button>
          
          <div className="flex items-center gap-4">
             <span className="text-[1.2rem] font-bold font-cinzel text-[var(--text-muted)] tracking-widest opacity-40">JOURNEY</span>
             <button
              onClick={() => setIsSubQuestModalOpen(true)}
              disabled={activeGuild.status === 'retired'}
              className={`px-10 py-4 rounded-[var(--radius-md)] font-bold flex items-center gap-3 shadow-md transition-all ${
                activeGuild.status === 'retired' 
                  ? "bg-[var(--text-muted)] text-[#ccc] cursor-not-allowed opacity-60" 
                  : "bg-[var(--accent-gold)] text-[var(--bg-dark)] hover:brightness-110 hover:shadow-lg active:scale-95"
              }`}
            >
              <i className="fa-solid fa-plus text-lg"></i> 項目追加
            </button>
          </div>
        </div>
        
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <span className="w-8 h-1 bg-[var(--accent-gold)] rounded-full"></span>
            <span className="text-[1rem] font-bold text-[var(--accent-gold)] uppercase tracking-[0.2em]">Target Roadmap</span>
          </div>
          <h2 className="text-[2.2rem] text-[var(--text-main)] font-black tracking-tight leading-tight">
            {targetQuest.name}
          </h2>
        </div>

        {/* Roadmap Tabs */}
        <div className="flex gap-1 mb-12 p-2 bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] max-w-fit">
          <button
            onClick={() => setRoadmapTab('stages')}
            className={`px-12 py-4 text-[1.1rem] font-bold rounded-[var(--radius-sm)] transition-all ${
              roadmapTab === 'stages' 
                ? 'bg-white text-[var(--text-main)] shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            ステージ枠 (一回限り)
          </button>
          <button
            onClick={() => setRoadmapTab('routines')}
            className={`px-12 py-4 text-[1.1rem] font-bold rounded-[var(--radius-sm)] transition-all ${
              roadmapTab === 'routines' 
                ? 'bg-white text-[var(--primary-color)] shadow-sm' 
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            ルーティン枠 (継続)
          </button>
        </div>

        <div className={roadmapTab === 'stages' ? "adventure-map-container max-w-6xl mx-auto px-10" : "compact-list-container"}>
          {roadmapTab === 'stages' && <div className="adventure-path"></div>}
          
          {/* Start Node */}
          {roadmapTab === 'stages' && (
            <div className="adventure-step">
              <div className="adventure-node" style={{ background: 'var(--bg-dark)', borderColor: 'var(--border-color)' }}>
                <i className="fa-solid fa-rocket text-[var(--accent-gold)]"></i>
              </div>
              <div className="adventure-card right opacity-60">
                 <span className="adventure-label text-left">The Beginning</span>
                 <h3 className="text-[1.3rem] font-bold">ギルドの旅路がここから始まる</h3>
              </div>
            </div>
          )}

          <div className={roadmapTab === 'stages' ? "py-10" : "flex flex-col gap-3 py-6"}>
            {subQuests.map((quest, index) => {
              const isCompleted = quest.type === 'routine' ? quest.lastCompleted === today : quest.isCompleted;
              const previousQuests = subQuests.slice(0, index);
              const allPreviousCompleted = previousQuests.every(q => q.type === 'routine' ? q.lastCompleted === today : q.isCompleted);
              const isActive = !isCompleted && allPreviousCompleted;
              const isLocked = !isCompleted && !allPreviousCompleted;
              const side = index % 2 === 0 ? 'left' : 'right';

              if (roadmapTab === 'routines') {
                return (
                  <div key={quest.id} className={`compact-quest-item ${isCompleted ? 'completed' : ''}`}>
                    <div className="compact-quest-info">
                       <div className="progress-container !m-0">
                        <div className={`progress-circle ${(quest.completionCount || 0) >= 7 ? 'full' : ''}`}
                             style={{ 
                               background: (quest.completionCount || 0) >= 7 
                                 ? 'var(--accent-gold)' 
                                 : `conic-gradient(var(--accent-gold) ${((quest.completionCount || 0) % 7) / 7 * 360}deg, transparent 0deg)`
                             }}>
                          {(quest.completionCount || 0) >= 7 && <i className="fa-solid fa-check"></i>}
                          <div className="progress-circle-inner"></div>
                        </div>
                        <span className="progress-text">{(quest.completionCount || 0)}/7</span>
                      </div>
                      <span className="compact-quest-title">{quest.name}</span>
                      <div className="flex items-center gap-1.5 font-bold text-[var(--accent-gold)] text-[0.8rem] ml-4">
                         <i className="fa-solid fa-crown text-[10px]"></i>
                         <span>{quest.points} pt</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => completeQuest(quest.id, quest.type)}
                      disabled={isCompleted || activeGuild.status === 'retired'}
                      className={`px-6 py-2 rounded-full border text-[0.8rem] transition-all font-black tracking-widest ${
                        isCompleted || activeGuild.status === 'retired'
                          ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed bg-transparent"
                          : "bg-[var(--accent-green)] border-transparent text-white hover:brightness-110"
                      }`}
                    >
                      {isCompleted ? "DONE" : "COMPLETE"}
                    </button>
                  </div>
                );
              }

              return (
                <div key={quest.id} className="adventure-step group">
                  <div className={`adventure-node transition-all duration-500 ${
                    isCompleted ? 'completed' : isActive ? 'active' : 'locked'
                  }`}>
                    {isCompleted ? (
                      <i className="fa-solid fa-check"></i>
                    ) : isActive ? (
                      <i className="fa-solid fa-bullseye"></i>
                    ) : (
                      <i className="fa-solid fa-lock"></i>
                    )}
                  </div>
                  
                  <div className={`adventure-card ${side} ${isLocked ? "opacity-40 grayscale" : ""}`}>
                     <span className="adventure-label">Stage {index + 1}</span>
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 justify-start sm:justify-end flex-row-reverse sm:flex-row">
                          <div className={`flex items-center gap-1.5 font-bold ${isCompleted ? "text-[var(--text-muted)]" : "text-[var(--accent-gold)]"}`}>
                             <i className="fa-solid fa-crown text-[10px]"></i>
                             <span>{quest.points} pt</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <h4 className={`text-[1.5rem] font-black transition-all leading-tight ${
                            isCompleted ? "text-[var(--text-muted)] line-through" : "text-[var(--text-main)]"
                          }`}>
                            {quest.name}
                          </h4>
                          
                          <div className="progress-container">
                            <div className={`progress-circle ${(quest.completionCount || 0) >= 7 ? 'full' : ''}`}
                                 style={{ 
                                   background: (quest.completionCount || 0) >= 7 
                                     ? 'var(--accent-gold)' 
                                     : `conic-gradient(var(--accent-gold) ${((quest.completionCount || 0) % 7) / 7 * 360}deg, transparent 0deg)`
                                 }}>
                              {(quest.completionCount || 0) >= 7 && <i className="fa-solid fa-check"></i>}
                              <div className="progress-circle-inner"></div>
                            </div>
                            <span className="progress-text">{quest.completionCount || 0}/7</span>
                          </div>
                        </div>
                        
                        <div className={`mt-4 ${side === 'left' ? 'text-right' : 'text-left'}`}>
                          <button
                            onClick={() => completeQuest(quest.id, quest.type)}
                            disabled={isCompleted || isLocked || activeGuild.status === 'retired'}
                            className={`px-8 py-3 rounded-full border text-[0.85rem] transition-all font-black tracking-widest shadow-sm active:scale-95 ${
                              isCompleted || activeGuild.status === 'retired'
                                ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed bg-transparent"
                                : isLocked ? "border-gray-100 text-gray-300 cursor-not-allowed" :
                                "bg-[var(--accent-green)] border-transparent text-white hover:brightness-110 hover:shadow-md"
                            }`}
                          >
                            {isCompleted ? "COMPLETED" : "COMPLETE"}
                          </button>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}

            {subQuests.length === 0 && (
               <div className="text-center py-20 opacity-60 bg-[var(--bg-dark)]/30 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--border-color)] max-w-lg mx-auto">
                  <i className="fa-solid fa-map-location-dot text-4xl mb-4 block"></i>
                  <p className="italic text-[1.2rem] text-[var(--text-muted)]">ルーティンがまだ設定されていません</p>
               </div>
            )}
          </div>

          {/* End/Goal Node */}
          {roadmapTab === 'stages' && (
            <div className="adventure-step">
              <div className="adventure-node" style={{ background: 'var(--bg-dark)', borderColor: 'var(--border-color)' }}>
                <i className="fa-solid fa-flag-checkered text-[var(--text-muted)]"></i>
              </div>
              <div className="adventure-card left opacity-60">
                 <span className="adventure-label">The End</span>
                 <h3 className="text-[1.3rem] font-bold text-[var(--text-muted)]">野望の完遂</h3>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <>
      {appData.activeTargetQuestId ? renderRoadmapView() : renderTopLevelQuests()}

      {/* New Top-Level Quest Modal */}
      <Modal isOpen={isQuestModalOpen} onClose={() => setIsQuestModalOpen(false)} title="クエストを発行">
        <div className="space-y-10">
          <div className="flex gap-4 p-2 bg-[var(--bg-dark)] rounded-[var(--radius-md)] mb-6 border border-[var(--border-color)]">
            <button 
              onClick={() => setQuestFormType('routine')}
              className={`flex-1 py-4 text-[1.2rem] font-bold rounded-[var(--radius-sm)] transition-all ${questFormType === 'routine' ? 'bg-white shadow-sm text-[var(--primary-color)] border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              ルーティンクエスト
            </button>
            <button 
              onClick={() => setQuestFormType('target')}
              className={`flex-1 py-4 text-[1.2rem] font-bold rounded-[var(--radius-sm)] transition-all ${questFormType === 'target' ? 'bg-white shadow-sm text-[var(--accent-gold)] border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              ターゲットクエスト
            </button>
          </div>

          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              内容 <span className="text-[var(--primary-color)]">*</span>
            </label>
            <input
              type="text"
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
              placeholder={questFormType === 'routine' ? "例: JavaScriptの基礎を復習する" : "例: エンジニアになる"}
              className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              報酬 (PT) <span className="text-[var(--primary-color)]">*</span>
            </label>
            <input
              type="number"
              value={questPoints}
              onChange={(e) => setQuestPoints(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="例: 50"
              className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {questFormType === 'routine' && (
            <div className="form-group">
              <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
                更新頻度
              </label>
              <select 
                value={questRecurrence}
                onChange={(e) => setQuestRecurrence(e.target.value)}
                className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner cursor-pointer"
              >
                <option value="daily">1日ごと (0:00更新)</option>
                <option value="weekly">1週間ごと</option>
              </select>
            </div>
          )}
          
          <button onClick={handleAddQuest} className={`w-full p-6 text-[1.6rem] rounded-[var(--radius-md)] font-bold text-[var(--bg-dark)] shadow-lg hover:brightness-110 active:scale-95 transition-all mt-6 ${questFormType === 'routine' ? 'bg-[var(--primary-color)]' : 'bg-[var(--accent-gold)]'}`}>
            確定
          </button>
        </div>
      </Modal>

      {/* New Sub-Quest Modal */}
      <Modal isOpen={isSubQuestModalOpen} onClose={() => setIsSubQuestModalOpen(false)} title="ロードマップ項目を追加">
         <div className="space-y-10">
          <div className="flex gap-4 p-2 bg-[var(--bg-dark)] rounded-[var(--radius-md)] mb-6 border border-[var(--border-color)]">
            <button 
              onClick={() => setSubQuestFormType('stage')}
              className={`flex-1 py-4 text-[1.2rem] font-bold rounded-[var(--radius-sm)] transition-all ${subQuestFormType === 'stage' ? 'bg-white shadow-sm text-[var(--text-main)] border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              ステージ (1回限り)
            </button>
            <button 
              onClick={() => setSubQuestFormType('routine')}
              className={`flex-1 py-4 text-[1.2rem] font-bold rounded-[var(--radius-sm)] transition-all ${subQuestFormType === 'routine' ? 'bg-white shadow-sm text-[var(--primary-color)] border border-[var(--border-color)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
            >
              ルーティンクエスト
            </button>
          </div>

          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              内容 <span className="text-[var(--primary-color)]">*</span>
            </label>
            <input
              type="text"
              value={subQuestName}
              onChange={(e) => setSubQuestName(e.target.value)}
              placeholder="例: 基礎を固める"
              className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div className="form-group">
            <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
              報酬 (PT) <span className="text-[var(--primary-color)]">*</span>
            </label>
            <input
              type="number"
              value={subQuestPoints}
              onChange={(e) => setSubQuestPoints(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="例: 30"
              className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner"
            />
          </div>

          {subQuestFormType === 'routine' && (
            <div className="form-group">
              <label className="block text-[1.1rem] font-bold text-[var(--text-muted)] mb-3 uppercase tracking-widest opacity-80">
                更新頻度
              </label>
              <select 
                value={subQuestRecurrence}
                onChange={(e) => setSubQuestRecurrence(e.target.value)}
                className="w-full p-6 text-[1.4rem] bg-[var(--bg-dark)] border border-[var(--border-color)] rounded-[var(--radius-md)] outline-none focus:border-[var(--primary-color)] focus:bg-white transition-all shadow-inner cursor-pointer"
              >
                <option value="daily">1日ごと</option>
                <option value="weekly">1週間ごと</option>
              </select>
            </div>
          )}
          
          <button onClick={handleAddSubQuest} className={`w-full p-6 text-[1.6rem] rounded-[var(--radius-md)] font-bold text-[var(--bg-dark)] shadow-lg hover:brightness-110 active:scale-95 transition-all mt-6 ${subQuestFormType === 'routine' ? 'bg-[var(--primary-color)] text-white' : 'bg-[var(--accent-gold)]'}`}>
            追加
          </button>
        </div>
      </Modal>
    </>
  );
}

