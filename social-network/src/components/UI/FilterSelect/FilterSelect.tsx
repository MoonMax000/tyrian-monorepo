'use client';

import { JSX, ReactNode, useEffect, useRef, useState } from 'react';
import ArrowIcon from './icons/arrow.svg';
import clsx from 'clsx';

export interface IFilterEl<T = string> {
  label: string;
  value: T;
  icon?: ReactNode;
}

interface FilterSelectProps<T> {
  selectedFilter: T;
  onFilterChange: (value: T) => void;
  filters: IFilterEl<T>[];
  className?: string;
}

const FilterSelect = <T,>({
  selectedFilter,
  onFilterChange,
  filters,
  className,
}: FilterSelectProps<T>): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentFilter = filters.find((filter) => filter.value === selectedFilter) || filters[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={clsx('relative w-full text-xs font-bold ', className)} ref={dropdownRef}>
      <div
        className='flex items-center justify-between rounded-md py-2 px-3 cursor-pointer text-webGray bg-blackedGray'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className='flex items-center gap-2'>
          {currentFilter.icon && <div className='w-4 h-4'>{currentFilter.icon}</div>}
          <span>{currentFilter.label}</span>
        </div>
        <div
          className={`transition-transform duration-200 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <ArrowIcon />
        </div>
      </div>
      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-blackedGray border-[1px] border-moonlessNight rounded-md shadow-lg'>
          {filters.map((filter) => (
            <div
              key={String(filter.value)}
              className='flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-moonlessNight'
              onClick={() => {
                onFilterChange(filter.value);
                setIsOpen(false);
              }}
            >
              {filter.icon && <div className='w-4 h-4'>{filter.icon}</div>}
              <span>{filter.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSelect;
