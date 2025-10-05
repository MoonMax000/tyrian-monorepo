import { useState, useRef } from 'react';
import clsx from 'clsx';
import { useClickOutside } from '@/hooks/useClickOutside';
import { SelectItem } from './SelectItem';
import { Option } from './types';
import IconArrow from '@/assets/Navbar/ArrowButton.svg';
import { SelectProps } from './types';

export const Select = ({
  options,
  onChange,
  placeholder,
  className,
  value,
  disabled,
  wrapperClassName
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
    <div className={clsx('relative text-xs ', wrapperClassName)} ref={selectRef}>
      <button
        type='button'
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        disabled={disabled}
        className={clsx(
          'w-full px-[10px] text-[15px] py-3 bg-transparent rounded-lg flex justify-between gap-2 items-center font-semibold  transition border-[1px] border-regaliaPurple',
          {
            'cursor-not-allowed opacity-50': disabled,
          },
          className,
        )}
      >
        <div className='flex gap-2 whitespace-nowrap'>
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder || 'Выберите...'}
        </div>
        <IconArrow className={clsx('transition', { 'rotate-180': isOpen })} />
      </button>

      {isOpen && !disabled && (
        <ul className='absolute w-full mt-1 bg-[#23252d] rounded-lg shadow-lg z-[100] text-[15px] font-bold'>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              option={option}
              onSelect={handleSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
