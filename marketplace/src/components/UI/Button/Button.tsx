import { cn } from '@/utils/cn';
import React from 'react';

type TVariants = 'primary' | 'danger' | 'secondary' | 'gray';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: TVariants;
  ghost?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ghost = false,
  onClick,
}) => {
  const base =
    'text-[15px] flex items-center justify-center text-white font-semibold rounded-[8px] py-[10px] px-[8px] transition-colors focus:outline-none hover:bg-[#523A83] focus:shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.25)]';

  const variants = {
    primary:
      'bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple hover:shadow-[0px_4px_4px_0px_#A06AFF66] focus:shadow-[inset_0px_4px_4px_0px_#00000040]',
    danger: 'bg-red',
    secondary: 'bg-[#0C101480] border border-regaliaPurple backdrop-blur-[100px] ',
    gray: '',
  };

  const ghostVariants = {
    primary: 'border border-regaliaPurple custom-bg-blur',
    danger: 'border border-darkRed text-red',
    secondary: '',
    gray: '',
  };

  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={cn(base, ghost ? ghostVariants[variant] : variants[variant], className)}
    >
      {children}
    </button>
  );
};

export default Button;
