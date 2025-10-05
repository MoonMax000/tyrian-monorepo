'use client';

import { FC, useRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface SelectCounterProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const SelectCounter: FC<SelectCounterProps> = ({
  value = 0,
  onChange,
  min = 0,
  max = Infinity,
  className,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<number | ''>(value || '');

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  const updateValue = (newValue: number | '') => {
    if (newValue === '') {
      setInternalValue('');
      onChange?.(0);
      return;
    }

    const parsed = Number(newValue);
    if (isNaN(parsed)) return;

    const clamped = Math.min(Math.max(parsed, min), max);
    setInternalValue(clamped);
    onChange?.(clamped);
  };

  return (
    <div className={clsx('hidden relative flex-1', className)}>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-white text-sm">
        $
      </div>
      <input
        type="number"
        ref={inputRef}
        value={internalValue}
        onChange={(e) => updateValue(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder="Amount"
        className={clsx(
          'w-full py-2 px-4 pr-8 bg-[#272A32] rounded-lg text-white focus:outline-none placeholder:text-white/50',
        )}
      />
    </div>
  );
};

export default SelectCounter;
