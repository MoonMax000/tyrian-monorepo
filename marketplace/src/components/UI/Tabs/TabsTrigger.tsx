'use client';

import { useTabs } from './Tabs';
import { TabsTriggerProps } from './types';
import { FC } from 'react';
import Button from '../Button/Button';
import { cn } from '@/utils/cn';

export const TabsTrigger: FC<TabsTriggerProps> = ({
  value,
  children,
  className,
  onClick,
  disabled,
  variant = 'default',
}) => {
  const { activeTab, setActiveTab } = useTabs();

  const handleClickTabTrigger = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }

    setActiveTab(value);
  };

  const isTabActive = activeTab === value;

  if (variant === 'outlined') {
    return (
      <button
        onClick={handleClickTabTrigger}
        className={cn('pb-4 text-[19px] font-bold', className, {
          'text-lighterAluminum': !isTabActive,
          'text-purple border-b-4 border-purple': isTabActive,
        })}
      >
        {children}
      </button>
    );
  }

  return (
    <Button
      className={cn(className, 'px-[14px]')}
      ghost={!isTabActive}
      onClick={handleClickTabTrigger}
    >
      {children}
    </Button>
  );
};
