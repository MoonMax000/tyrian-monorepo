import React from 'react';
import { TabsListProps } from './types';
import { cn } from '@/utilts/cn';

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={cn(className, 'flex border-b border-regaliaPurple space-x-6')}
    >
      {children}
    </div>
  );
};
