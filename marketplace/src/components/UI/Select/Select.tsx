import { useState, useRef } from 'react';
import clsx from 'clsx';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SelectItem } from './SelectItem';
import { SelectProps, Option } from '@/components/UI/Select/types';

import IconArrow from '@/assets/icons/icon-arrow-select.svg';

export const Select = ({
  options,
  onChange,
  placeholder,
  className,
  value,
  disabled,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option);
    setIsOpen(false);
  };

  useClickOutside(selectRef, () => setIsOpen(false));

  return (
    <div className={clsx('relative text-xs', className)} ref={selectRef}>
      <button
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        disabled={disabled}
        className={clsx(
          'w-full px-3 py-3 custom-bg-blur rounded-lg flex justify-between gap-2 items-center border-[1px] border-regaliaPurple font-semibold text-lighterAluminum transition',
          {
            'cursor-not-allowed opacity-50': disabled,
          },
        )}
      >
        <div className='flex gap-2'>
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder || 'Выберите...'}
        </div>
        <IconArrow
          width={10}
          height={10}
          className={clsx('transition', { 'rotate-180': isOpen })}
        />
      </button>

      {isOpen && !disabled && (
        <ul className='absolute w-full mt-1 custom-bg-blur rounded-lg shadow-lg z-10'>
          {options.map((option) => (
            <SelectItem key={option.value} option={option} onSelect={handleSelect} />
          ))}
        </ul>
      )}
    </div>
  );
};
