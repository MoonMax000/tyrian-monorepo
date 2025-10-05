'use client';
import { cn } from '@/utils/cn';
import { FC, ReactNode, useState } from 'react';

interface HorizontalGradientProps {
  children: ReactNode;
}

const HorizontalGradient: FC<HorizontalGradientProps> = ({ children }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <div
      className={cn(
        `p-[1px] rounded-2xl border-transparent w-full transition-all duration-500 ${
          isHovered ? 'bg-gradient-to-t from-[#A06AFF] to-[rgba(24,26,32,0.5)]' : ''
        }`,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative rounded-2xl p-4 w-full h-full bg-[#181A20] transition-all duration-500 ${
          isHovered
            ? 'bg-gradient-to-l from-[rgba(160,106,255,0.1)] via-[rgba(24,26,32,0.5)] to-[rgba(24,26,32,0.6)]'
            : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalGradient;
