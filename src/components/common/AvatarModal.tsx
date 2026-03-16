"use client";

import React from 'react';
import Modal from './Modal';
import { useGuild } from '@/context/GuildContext';
import { useUI } from '@/context/UIContext';
import { AVATARS } from '@/constants/avatars';

export default function AvatarModal() {
  const { activeGuild, updateAvatar } = useGuild();
  const { isAvatarModalOpen, setAvatarModalOpen } = useUI();

  if (!activeGuild) return null;

  const { state } = activeGuild;

  return (
    <Modal
      isOpen={isAvatarModalOpen}
      onClose={() => setAvatarModalOpen(false)}
      title="アイコンを選択"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-6 space-y-12 scroll-smooth">
        {Object.entries(AVATARS).map(([category, icons]) => (
          <div key={category}>
            <h4 className="text-[1.2rem] font-bold text-[var(--text-muted)] mb-8 pb-4 border-b-2 border-[var(--bg-dark)] flex items-center gap-4">
              {category === "人・職業" ? <i className="fa-solid fa-user-tag text-[var(--primary-color)] text-2xl"></i> : <i className="fa-solid fa-paw text-[var(--primary-color)] text-2xl"></i>}
              {category}
            </h4>
            <div className="grid grid-cols-4 gap-8">
              {icons.map((avatar) => (
                <div
                  key={avatar.icon}
                  onClick={() => {
                    updateAvatar(avatar.icon);
                    setAvatarModalOpen(false);
                  }}
                  className={`aspect-square flex items-center justify-center text-[4rem] rounded-[2rem] cursor-pointer transition-all ${
                    state.avatar === avatar.icon
                      ? "bg-[rgba(140,163,143,0.15)] border-4 border-[var(--primary-color)] text-[var(--primary-color)] shadow-sm"
                      : "bg-[var(--bg-dark)] border-4 border-transparent text-[var(--text-muted)] hover:bg-white hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] hover:-translate-y-2 hover:shadow-xl"
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
  );
}
