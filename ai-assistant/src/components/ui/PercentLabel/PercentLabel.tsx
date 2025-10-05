import React, { FC } from 'react';
import { cn } from '@/utilts/cn';

interface PercentLabelProps {
  value: number | null;
  className?: string;
  showPlus?: boolean;
  isNeedCover?: boolean;
}

export const PercentLabel: FC<PercentLabelProps> = ({ value, className, showPlus = true, isNeedCover = false }) => {
  if (value === null) return <span className={className}>-</span>;

  const isPositive = value > 0;
  const isNegative = value < 0;
  const sign = isPositive && showPlus ? '+' : '';

  return (
    <span
      className={cn(
        className,
        isPositive &&
          (isNeedCover
            ? 'bg-darkGreen text-green px-1 py-[2px] rounded-md'
            : 'text-green'),
        isNegative &&
          (isNeedCover ? 'bg-darkRed text-red px-1 py-[2px] rounded-md' : 'text-red'),
      )}
    >
      {sign}
      {value.toFixed(1)}%
    </span>
  );
};
