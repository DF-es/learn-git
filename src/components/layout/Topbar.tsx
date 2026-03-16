import { useGuild } from "@/context/GuildContext";
import { useEffect, useState, useRef } from "react";
import { useUI } from "@/context/UIContext";

export default function Topbar() {
  const { activeGuild } = useGuild();
  const { setAvatarModalOpen } = useUI();
  const [animateType, setAnimateType] = useState<'gain' | 'spend' | null>(null);
  const prevPoints = useRef<number | null>(null);

  useEffect(() => {
    if (activeGuild) {
      const currentPoints = activeGuild.state.points;
      if (prevPoints.current !== null && currentPoints !== prevPoints.current) {
         
        setAnimateType(currentPoints > prevPoints.current ? 'gain' : 'spend');
        const timer = setTimeout(() => setAnimateType(null), 300);
        prevPoints.current = currentPoints;
        return () => clearTimeout(timer);
      }
      prevPoints.current = currentPoints;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGuild?.state.points]);

  if (!activeGuild) return null;

  const { state } = activeGuild;

  return (
    <header 
      className="flex justify-between items-center bg-[var(--bg-dark)] sticky top-0 z-[100] transition-all duration-500"
      style={{ padding: '24px 160px' }}
    >
      <div className="flex items-center gap-5">
        <div 
          onClick={() => activeGuild.status !== 'retired' && setAvatarModalOpen(true)}
          style={{ width: '84px', height: '84px' }}
          className={`rounded-full bg-[var(--bg-panel)] border-none flex items-center justify-center text-[var(--primary-color)] shadow-sm hover:shadow-md transition-all duration-400 group relative ${activeGuild.status === 'retired' ? 'cursor-default' : 'cursor-pointer hover:border-[var(--primary-color)] hover:scale-105'}`}
        >
          <i id="user-avatar-icon" style={{ fontSize: '2.4rem' }} className={`fa-solid ${state.avatar}`}></i>
          {activeGuild.status !== 'retired' && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
              <i style={{ fontSize: '1.2rem' }} className="fa-solid fa-camera text-[var(--primary-color)]"></i>
            </div>
          )}
        </div>
        <div className="details">
          <span style={{ fontSize: '0.9rem' }} className="block text-[var(--text-muted)] uppercase tracking-widest font-bold tracking-[3px] mb-1">
            ギルドマスター
          </span>
          <h2 style={{ fontSize: '1.8rem' }} className="font-bold text-[var(--text-main)] font-cinzel leading-none">冒険者の帰還</h2>
        </div>
      </div>
      <div className="text-right flex flex-col items-end">
        <span className="block text-[0.75rem] text-[var(--text-muted)] tracking-wider font-bold mb-1">
          所持ポイント
        </span>
        <div 
          className={`flex items-center gap-2 text-[2.2rem] font-bold transition-all duration-300 ${
            animateType === 'gain' ? 'scale-110 text-[var(--accent-green)]' : 
            animateType === 'spend' ? 'scale-90 text-[var(--accent-red)]' : 
            'text-[var(--primary-color)]'
          }`}
        >
          <i className="fa-solid fa-coins text-[1.5rem] opacity-70"></i>
          <span className="font-cinzel tracking-tighter text-[var(--text-main)]">{state.points}</span>
          <span className="text-[1rem] text-[var(--text-main)] font-medium ml-1">pt</span>
        </div>
      </div>
    </header>
  );
}
