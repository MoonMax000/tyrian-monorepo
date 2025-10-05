import React from 'react';
import clsx from 'clsx';
import { TabsListProps } from './types';

export const TabsList: React.FC<TabsListProps> = ({
  children,
  withUnderLine = true,
  className,
}) => {
  return (
    <div
      className={clsx(className, 'flex space-x-4', {
        'border-b border-regaliaPurple border-opacity-10': withUnderLine,
      })}
    >
      {children}
    </div>
  );
};
