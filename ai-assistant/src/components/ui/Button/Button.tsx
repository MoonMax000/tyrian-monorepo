import React, { FC } from 'react';
import { cn } from '@/utilts/cn';

type TVariants =
  | 'primary'
  | 'danger'
  | 'secondary'
  | 'red'
  | 'orange'
  | 'green'
  | 'gray'
  | 'support'
  | 'transparent';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  variant?: TVariants;
  ghost?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
};

const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ghost = false,
  onClick,
  disabled,
  icon,
}) => {
  const base =
    'text-[15px] flex items-center justify-center text-white font-bold rounded-[8px] py-[10px] px-[8px] transition-colors focus:outline-none';

  const variants = {
    primary:
      'bg-gradient-to-r from-darkPurple to-lightPurple border-darkPurple',
    danger: 'bg-red',
    orange: 'bg-[#FFA80029] text-[#FFA800] backdrop-blur-[100px]',
    red: 'bg-[#3A2127] text-[#EF454A] backdrop-blur-[100px]',
    support: 'text-white border border-regaliaPurple backdrop-blur-[100px]',
    green: 'bg-[#1C3430] text-[#2EBD85] backdrop-blur-[100px]',
    gray: 'bg-[#B0B0B029] text-[#B0B0B0] backdrop-blur-[100px]',
    secondary:
      'bg-[#0C101480] border border-regaliaPurple backdrop-blur-[100px]',
    transparent: 'bg-transparent text-[#B0B0B0]',
  };

  const ghostVariants = {
    primary: 'border border-regaliaPurple text-lightPurple',
    danger: 'border border-darkRed text-red',
    //Все что ниже можно менять
    secondary: '',
    orange: 'bg-[#FFA80029] text-[#FFA800] backdrop-blur-[100px]',
    red: 'border border-darkRed text-[#EF454A] backdrop-blur-[100px]',
    support: 'text-white border border-regaliaPurple backdrop-blur-[100px]',
    green: 'bg-[#1C3430] text-[#2EBD85] backdrop-blur-[100px]',
    gray: 'bg-[#B0B0B029] text-[#B0B0B0] backdrop-blur-[100px]',
    transparent: 'bg-transparent text-[#B0B0B0]',
  };

  const handleClick = () => {
    if (!onClick) return;
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      className={cn(
        base,
        ghost ? ghostVariants[variant] : variants[variant],
        className,
        { 'opacity-45': disabled },
      )}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
