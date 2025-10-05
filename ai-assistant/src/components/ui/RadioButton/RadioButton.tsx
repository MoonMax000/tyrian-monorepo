import React from 'react';
import { cn } from '@/utilts/cn';

type RadioButtonProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  name: string;
  value: string;
};

const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  label,
  description,
  className = '',
  disabled = false,
  name,
  value,
}) => {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer select-none',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      <input
        type="radio"
        className="hidden"
        checked={checked}
        onChange={() => onChange(true)}
        name={name}
        value={value}
        disabled={disabled}
      />
      <span
        className={cn(
          'block w-[16px] h-[16px] rounded-full border-[2px] flex-shrink-0 flex items-center justify-center transition bg-white',
          disabled && 'bg-neutral-900'
        )}
      >
        {checked ? (
          <span className="block w-2.5 h-2.5 rounded-full bg-lightPurple" />
        ) : null}
      </span>
      <div>
        <div className={'font-bold text-[15px] leading-none'}>
          {label}
        </div>
        {description && (
          <div className="text-lighterAluminum font-[500] text-[15px] mt-1">{description}</div>
        )}
      </div>
    </label>
  );
};

export default RadioButton;