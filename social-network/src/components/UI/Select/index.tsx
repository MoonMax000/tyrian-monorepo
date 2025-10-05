'use client';

import { useClickOutside } from '@/hooks/useClickOutside';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, RefObject, useMemo, useRef, useState } from 'react';

export interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value?: string;
  options?: Option[];
  placeholder?: string;
  onChange?: (_value: Option['value'] | undefined) => void;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  classNameMenuItem?: string;
}

const Select: FC<SelectProps> = ({
  options = [],
  value,
  placeholder = '',
  onChange,
  className,
  icon,
  iconPosition = 'right',
  classNameMenuItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef as RefObject<HTMLElement>, () => setIsOpen(false));

  const handleChange = (option: Option) => {
    onChange?.(value === option.value ? undefined : option.value);
    setIsOpen(false);
  };

  const selectedOption = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [value, options]);

  const displayText = selectedOption?.label || placeholder;

  return (
    <div className={clsx('relative flex-1 z-0', className)} ref={wrapperRef}>
      {icon && iconPosition === 'left' && (
        <div className=' inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>{icon}</div>
      )}
      <div
        className={clsx('w-full px-4 py-2 rounded-lg cursor-pointer', {
          'pl-10': icon && iconPosition === 'left',
          'pr-10': icon && iconPosition === 'right',
        })}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <p className='text-lighterAluminum text-body-15 truncate'>{displayText}</p>
      </div>
      {icon && iconPosition === 'right' && (
        <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
          {icon}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className='absolute top-full left-0 w-full mt-1 z-10 bg-custom-dark border-[1px] border-regaliaPurple rounded-lg shadow-md'
          >
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.value}
                  className={clsx(
                    'text-white px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors',
                    classNameMenuItem,
                  )}
                  onClick={() => handleChange(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className='hidden text-gray-400 px-4 py-2'>No options</li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Select;
