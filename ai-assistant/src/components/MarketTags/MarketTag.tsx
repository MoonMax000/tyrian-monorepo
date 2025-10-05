import React from 'react';
import { cn } from '@/utilts/cn';
import Bullish from '@/assets/vectors/greenVector.svg';
import Bearish from '@/assets/vectors/redVector.svg';

type MarketTagProps = {
    isPositive: boolean;
    className?: string;
    children: React.ReactNode;
};

export const MarketTag: React.FC<MarketTagProps> = ({
    isPositive,
    className,
    children,
    ...props
}) => {
    const Icon = isPositive ? Bullish : Bearish;
    return (
        <span
            className={cn(
                'flex items-center h-[20px] gap-[4px] px-[4px] py-[4px] rounded-[4px] text-[12px] font-[800] text-white transition-colors',
                {
                    'bg-darkGreen': isPositive,
                    'bg-darkRed': !isPositive,
                },
                className
            )}
            {...props}
        >
            <Icon className="w-4 h-4" />
            {children}
        </span>
    );
};