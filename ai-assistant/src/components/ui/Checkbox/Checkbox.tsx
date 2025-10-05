import { cn } from '@/utilts/cn';
import React from 'react';
import CheckIcon from '@/assets/system-icons/checkIcon';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
  label?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  className = '',
  disabled = false,
  label,
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="hidden"
      />
      <span
        className={cn(
          'flex items-center justify-center w-6 h-6 rounded-md transition-colors',
          {
            'bg-lightPurple': checked,
            'border border-gunpowder': !checked,
          }
  )}
      >
        {checked && (
          <CheckIcon  className="w-4 h-4 text-white" />
        )}
      </span>
      {label && <span className="ml-2 text-white text-[15px] font-medium">{label}</span>}
    </label>
  );
};

export default Checkbox;