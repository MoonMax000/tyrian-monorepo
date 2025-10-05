'use client';

import { FC } from 'react';

export type HomeTab = 'Popular' | 'Editors' | 'ForYou' | 'Following';

type PanelItem = {
  id: HomeTab;
  label: string;
};

interface Props {
  activeTab: HomeTab;
  onTabChange: (tab: HomeTab) => void;
}

const navItems: PanelItem[] = [
  { id: 'Popular', label: 'Popular' },
  { id: 'Editors', label: 'Editor’s picks' },
  { id: 'ForYou', label: 'For You' },
  { id: 'Following', label: 'Following' },
];

export const ButtonsPanel: FC<Props> = ({ activeTab, onTabChange }) => {
  return (
    <section className='flex justify-center px-6 py-[21px] items-center gap-3 mb-[48px]'>
      {navItems.map(({ id, label }) => (
        <button
          key={id}
          className={`px-5 h-[40px] rounded-[8px] text-[15px] font-bold transition
            ${
              activeTab === id
                ? 'bg-gradient-to-r from-darkPurple to-lightPurple text-white'
                : 'custom-bg-blur text-white border border-regaliaPurple'
            }`}
          onClick={() => onTabChange(id)}
        >
          {label}
        </button>
      ))}
    </section>
  );
};
