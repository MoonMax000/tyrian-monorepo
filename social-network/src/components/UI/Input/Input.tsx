import React from 'react';
import clsx from 'clsx';

import { InputProps } from '@/components/UI/Input/types';

const Input = ({
                 type = 'text',
                 placeholder = '',
                 value = '',
                 onChange,
                 className,
                 disabled = false,
                 icon,
                 iconPosition = 'left',
               }: InputProps) => {
  return (
    <div className={clsx('relative flex-1', className)}>
      {icon && iconPosition === 'left' && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={clsx(
          'w-full px-4 py-2 border-2 border-onyxGrey bg-[#272A32] rounded-lg focus:outline-none',
          {
            'pl-10': icon && iconPosition === 'left', 
            'pr-10': icon && iconPosition === 'right', 
          },
        )}
      />
      {icon && iconPosition === 'right' && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;