import { useState, useRef } from "react";
import clsx from 'clsx';
import { useClickOutside } from "@/hooks/useClickOutside";
import { SelectItem } from './SelectItem';
import { SelectProps, Option } from '@/components/UI/Select/types';

import IconArrow from '@/assets/icons/icon-arrow-select.svg'

export const Select = ({ options, onChange, placeholder, className, value, disabled  }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange(option);
    setIsOpen(false);
  };

  useClickOutside(selectRef as any, () => setIsOpen(false));

  return (
    <div className={clsx("relative w-48", className)} ref={selectRef}>
      <button
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        disabled={disabled}
        className={clsx(
          "w-full px-3 py-2.5 bg-[#23252d] rounded-lg flex justify-between items-center font-semibold text-[#8d8e92] transition",
          {
            "cursor-not-allowed opacity-50": disabled
          }
        )}
      >
        <div className="flex gap-2">
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder || "Выберите..."}
        </div>
        <IconArrow className={clsx('transition', { "rotate-180": isOpen })} />
      </button>

      {isOpen && !disabled && (
        <ul className="absolute w-full mt-1 bg-[#23252d] rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <SelectItem key={option.value} option={option} onSelect={handleSelect} />
          ))}
        </ul>
      )}
    </div>
  );
};
