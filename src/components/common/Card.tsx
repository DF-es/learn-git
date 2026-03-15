import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
}

export default function Card({ title, children, className = "", headerAction }: CardProps) {
  return (
    <div className={`bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-10 shadow-[var(--shadow-gentle)] transition-all duration-300 ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-8">
          {title && <h3 className="text-[var(--primary-color)] font-cinzel font-bold text-[1.4rem] tracking-wide">{title}</h3>}
          {headerAction}
        </div>
      )}
      <div className="text-[var(--text-main)] leading-relaxed">
        {children}
      </div>
    </div>
  );
}
