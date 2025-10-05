import React from 'react';
import { cn } from '@/utilts/cn';
import Bullish from '@/assets/vectors/greenVector.svg';
import Bearish from '@/assets/vectors/redVector.svg';

type MarketTagBigProps = {
  isPositive: boolean;
  contained?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const PositiveNegativeTrend: React.FC<MarketTagBigProps> = ({
  isPositive,
  contained = false,
  className,
  children,
  ...props
}) => {

  return (
    <span
      className={cn(
        'flex items-center h-[32px] gap-[4px] px-2 py-[6px] rounded-[8px] text-[15px] font-bold text-white transition-colors', className,
        {
          'bg-gradient-to-r from-darkPurple to-lightPurple': contained,
          'bg-transparent': !contained
        }
      )}
      {...props}
    >
      {isPositive &&
        <Bullish className="w-4 h-4" />
      }
      {children}

      {!isPositive &&
        <Bearish className="w-4 h-4" />
      }
    </span>
  );
};