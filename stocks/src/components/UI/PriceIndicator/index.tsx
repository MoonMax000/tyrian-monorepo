import React from 'react';
import clsx from 'clsx';
import { formatNumber } from '@/helpers/formatNumber';

interface PriceIndicatorProps {
  percentChange: number;
  className?: string;
}

const PriceIndicator: React.FC<PriceIndicatorProps> = ({ percentChange, className }) => {
  const isPositive = percentChange >= 0;

  return (
    <span
      className={clsx(
        'inline-block px-2 py-1 text-[12px] rounded-[4px] font-extrabold text-center',
        className,
        {
          'bg-darkGreen text-green': isPositive,
          'bg-darkRed text-red': !isPositive,
        },
      )}
    >
      {isPositive && '+'}
      {formatNumber(percentChange.toFixed(2), '%')}
    </span>
  );
};

export default PriceIndicator;
