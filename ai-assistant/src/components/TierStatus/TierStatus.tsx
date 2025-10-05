import React from "react";
import Icon1 from '@/assets/statuses/Brown1.svg';
import Icon2 from '@/assets/statuses/Green2.svg';
import Icon3 from '@/assets/statuses/Gold3.svg';
import Icon4 from '@/assets/statuses/Purple4.svg';

type Status = 1 | 2 | 3 | 4;

interface TierStatusProps {
    status: Status;
    className?: string;
}

const iconMap = {
    1: Icon1,
    2: Icon2,
    3: Icon3,
    4: Icon4,
};

export const TierBadge: React.FC<TierStatusProps> = ({ status, className }) => {
    const Icon = iconMap[status];

    return (
        <span className={`inline-flex items-center ${className ?? ""}`}>
            <Icon className={'w-[18px] h-[20px]'} />
        </span>
    );
};