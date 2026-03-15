import { useGuild } from "@/context/GuildContext";
import { useEffect, useState, useRef } from "react";

export default function Topbar() {
  const { activeGuild } = useGuild();
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
  }, [activeGuild?.state.points]);

  if (!activeGuild) return null;

  const { state } = activeGuild;

  return (
    <header className="p-8 px-16 flex justify-between items-center bg-[var(--bg-panel)] border-b border-[var(--border-color)] sticky top-0 z-[100] transition-all duration-500 shadow-[var(--shadow-gentle)]">
      <div className="flex items-center gap-5">
        <div className="w-[56px] h-[56px] rounded-full bg-[var(--bg-dark)] border-2 border-[var(--border-color)] flex items-center justify-center text-[1.6rem] text-[var(--primary-color)] cursor-pointer hover:border-[var(--primary-color)] hover:shadow-sm transition-all duration-400">
          <i id="user-avatar-icon" className={`fa-solid ${state.avatar}`}></i>
        </div>
        <div className="details">
          <span className="block text-[0.7rem] text-[var(--primary-color)] uppercase tracking-widest font-bold tracking-[3px] opacity-80">
            Guild Master
          </span>
          <h2 className="text-[1.3rem] font-bold text-[var(--text-main)] font-cinzel">冒険者</h2>
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
          <span className="font-cinzel tracking-tighter">{state.points}</span>
          <span className="text-[1rem] font-medium ml-1">pt</span>
        </div>
      </div>
    </header>
  );
}
