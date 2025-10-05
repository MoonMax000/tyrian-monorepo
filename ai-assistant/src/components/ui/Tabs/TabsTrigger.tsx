'use client';

import React from 'react';

import { useTabs } from './Tabs';
import { TabsTriggerProps } from './types';
import { cn } from '@/utilts/cn';

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  onClick,
}) => {
  const { activeTab, setActiveTab } = useTabs();

  const handleClickTabTrigger = () => {
    if (onClick) {
      onClick();
    }

    setActiveTab(value);
  };

  const isTabActive = activeTab === value;

  return (
    <button
      className={cn(
        'text-[15px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-lighterAluminum',
        className,
        {
          '!text-purple border-b-purple': isTabActive,
        },
      )}
      onClick={handleClickTabTrigger}
    >
      {children}
    </button>
  );
};
