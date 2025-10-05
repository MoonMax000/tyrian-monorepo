import React from 'react';
import { cn } from '@/utilts/cn';

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  className,
}) => {
  const percent = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        'w-full h-2 rounded-[4px] overflow-hidden',
        'bg-gradient-to-r from-[#23252D] to-[#0B0E11]',
        className,
      )}
    >
      <div
        className='h-full rounded-[4px] bg-gradient-to-r from-[#482090] to-[#A06AFF]'
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};
