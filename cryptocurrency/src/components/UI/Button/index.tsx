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
  size = 'md'
}: ButtonProps) => {
  return (
    <button
      className={clsx('text-[15px] font-bold rounded-lg truncate', {
        'bg-[#A06AFF]': variant === 'primary',
        'bg-transparent border-[2px] border-white border-opacity-[16%]': variant === 'secondary',
        'bg-transparent border border-[#FF5757] border-opacity-50 text-[#FF5757]':
          variant === 'danger',
        'bg-[#212328] text-[#8c8d90]': variant === 'shadow',
        'flex justify-center items-center gap-3': icon && children,
        'opacity-60 cursor-not-allowed': disabled,
        'w-full': fullWidth,
        'py-[7px] px-[11px]': size === 'sm',
        'py-3 px-4': size === 'md'
      }, className)}
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