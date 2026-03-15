"use client";

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[8px] z-[3000] flex items-center justify-center p-6 transition-all">
      <div className="bg-[var(--bg-panel)] rounded-[var(--radius-lg)] w-full max-w-[440px] p-10 shadow-[var(--shadow-hover)] animate-scaleIn border border-[var(--border-color)]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[var(--primary-color)] font-cinzel font-bold text-[1.4rem] tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="bg-transparent border-none text-[var(--text-muted)] text-[1.5rem] cursor-pointer hover:text-[var(--text-main)] transition-colors p-1"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="modal-content text-[var(--text-main)]">
          {children}
        </div>
      </div>
    </div>
  );
}
