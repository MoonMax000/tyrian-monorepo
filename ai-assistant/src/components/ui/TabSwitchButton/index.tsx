'use client';

import { FC, ReactNode } from 'react';
import Button from '@/components/ui/Button/Button';
import { cn } from '@/utilts/cn';

interface TabSwitchButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

const TabSwitchButton: FC<TabSwitchButtonProps> = ({ active, onClick, children, className }) => {
  return (
    <Button
      onClick={onClick}
      variant={active ? 'primary' : 'transparent'}
      ghost={!active}
      className={cn('w-[180px]', className)}
    >
      {children}
    </Button>
  );
};

export default TabSwitchButton;
