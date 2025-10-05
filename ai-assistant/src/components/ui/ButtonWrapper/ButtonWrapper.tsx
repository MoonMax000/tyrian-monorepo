import React, { ReactNode } from 'react';
import { cn } from '@/utilts/cn';

type ButtonWrapperProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  defaultColor?: string;
  hoverColor?: string;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

const ButtonWrapper: React.FC<ButtonWrapperProps> = ({
  children,
  className,
  ariaLabel = 'icon button',
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type='button'
      aria-label={ariaLabel || 'button'}
      className={cn(
        `w-fit flex items-center justify-center rounded-[8px] border border-regaliaPurple p-2 box-border backdrop-blur-[100px] transition-colors duration-200 
        active:scale-95 bg-[#0C1014]/50 group`,
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ButtonWrapper;
