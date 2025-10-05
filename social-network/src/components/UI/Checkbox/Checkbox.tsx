import React from 'react';
import clsx from 'clsx';

import { CheckboxProps } from '@/components/UI/Checkbox/types';

const Checkbox = ({
  checked = false,
  onChange,
  label,
  className,
  disabled = false,
}: CheckboxProps) => {
  return (
    <label className={clsx('flex flex-col gap-2 items-center', className)}>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className='hidden'
        readOnly={disabled || !onChange}
      />
      {label && <span className='text-[#b8b8b8] text-[13px] whitespace-nowrap'>{label}</span>}

      <div
        className={clsx(
          'flex items-center justify-center w-[18px] h-[18px] border-2 border-gray-300 rounded transition-all',
          {
            'bg-primary border-primary': checked,
            'bg-transparent border-onyxGrey': !checked,
            'opacity-50 cursor-not-allowed': disabled,
          },
        )}
      >
        {checked && (
          <svg
            width='12'
            height='8'
            viewBox='0 0 12 8'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1 2.5L5 6.5L10.5 1'
              stroke='#F2F2F2'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
