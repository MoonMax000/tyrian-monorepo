'use client';
import clsx from 'clsx';
import { ButtonProps } from './types';

const Button = ({
  children,
  className,
  onClick,
  variant = 'primary',
  type = 'submit',
  icon,
  disabled,
  fullWidth,
  isActive = false,
}: ButtonProps) => {
  return (
    <button
      className={clsx('h-11 text-[15px] font-semibold py-3 px-3 rounded-lg truncate', className, {
        'bg-[#23252D]': variant === 'dark',
        'text-white border border-purple': variant === 'dark' && isActive,
        'text-webGray border-none': variant === 'dark' && !isActive,

        'bg-[#A06AFF]': variant === 'primary',
        'bg-transparent border border-onyxGrey': variant === 'secondary',
        'bg-transparent border border-red border-opacity-50 text-red opacity-80':
          variant === 'danger',
        'bg-transparent border border-onyxGrey text-webGray': variant === 'shadow',
        'bg-transparent text-white': variant === 'ghost',
        'text-lighterAluminum border-[1px] border-regaliaPurple custom-bg-blur':
          variant === 'ghostPurpule',
        'w-[180px]': children,
        'flex justify-center items-center gap-3': icon && children,
        'opacity-60 cursor-not-allowed': disabled,
        'w-full': fullWidth,
        'bg-blackedGray border border-transparent text-white': variant === 'blacked',
        'bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)] text-white': variant === 'gradient',
      })}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon}
      <span className={clsx({ 'max-w-[120px]': !fullWidth })}>{children}</span>
    </button>
  );
};

export default Button;
