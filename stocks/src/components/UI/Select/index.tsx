'use client';

import IconChevronDown from '@/assets/icons/chevron-down.svg';
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
  label?: string;
  onChange?: (_value: Option['value'] | undefined) => void;
  className?: string;
  selectIconClasses?: string;
  labelClassname?: string;
  wrapperClassName?: string;
  fieldClassname?: string;
  variant?: 'white' | 'transparent' | 'gray';
  classNameOptions?: string;
  classNameOption?: string;
}

const variants: Record<NonNullable<SelectProps['variant']>, string> = {
  white: 'bg-white',
  transparent: 'bg-transparent',
  gray: 'bg-blackedGray rounded-lg border-2 border-blackedGray',
};

const Select: FC<SelectProps> = ({
  options,
  value,
  placeholder,
  label,
  onChange,
  className,
  wrapperClassName,
  labelClassname,
  fieldClassname,
  variant = 'white',
  selectIconClasses,
  classNameOptions,
  classNameOption,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef as RefObject<HTMLElement>, () => setIsOpen(false));

  const handleChange = (option: Option) => {
    onChange?.(value === option.value ? undefined : option.value);
    setIsOpen(false);
  };

  const selectedOption = useMemo((): Option | undefined => {
    if (!value || !options || options.length === 0) return undefined;

    return options.find((option) => option.value === value);
  }, [value, options]);

  let actualValue = '...';
  if (placeholder) {
    actualValue = placeholder;
  }
  if (value) {
    if (selectedOption) {
      actualValue = selectedOption.label;
    } else {
      actualValue = value;
    }
  }

  return (
    <div className={clsx('w-full', wrapperClassName)}>
      {label && <p className={clsx('text-base leading-4 mb-1', labelClassname)}>{label}</p>}
      <div className={clsx('w-full relative', variants[variant], className)} ref={wrapperRef}>
        <div
          className={clsx(
            'flex items-center justify-center gap-[10px] py-1 px-[10px]',
            fieldClassname,
          )}
          role='button'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <p className='text-body-15 line-clamp-1'>{actualValue}</p>
          <IconChevronDown
            className={clsx(
              'text-purple',
              {
                'rotate-180': isOpen,
                'rotate-0': !isOpen,
              },
              selectIconClasses,
            )}
          />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                'absolute top-full left-0 rounded-xl border border-blackedGray w-full bg-white z-40',
                classNameOptions,
              )}
            >
              {options && options.length > 0 ? (
                options.map((option) => (
                  <li
                    key={option.value}
                    className={clsx(
                      'text-body-15 text-blackedGray custom-truncate p-2 transition-colors hover:bg-medium-gray hover:text-white',
                      classNameOption,
                    )}
                    role='button'
                    onClick={() => handleChange(option)}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <p className='text-blackedGray p-2'>No options</p>
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Select;
