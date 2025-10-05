import { cn } from '@/utils/cn';
import { FC } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch: FC<SwitchProps> = ({ checked, onChange, disabled = false, className }) => {
  return (
    <div
      className={cn(
        'relative w-[48px] h-[26px] cursor-pointer transition-all duration-300 ease-in-out',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div
        className={cn(
          'absolute left-[0.5px] w-12 h-[26px] rounded-[13px] transition-all duration-300 ease-in-out',
          checked 
            ? 'bg-gradient-to-r from-[var(--color-darkPurple)] to-[var(--color-lavenderIndigo)]' 
            : 'bg-[var(--color-onyxGrey)]'
        )}
      />
      
      <div
        className={cn(
          'absolute top-[2px] w-[22px] h-[22px] bg-white rounded-full transition-all duration-300 ease-in-out shadow-lg',
          checked ? 'left-9 translate-x-[-11px]' : 'left-[2px]'
        )}
        style={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.36)'
        }}
      />
    </div>
  );
};

export default Switch;
