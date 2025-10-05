'use client';

import { forwardRef } from 'react';
import { InputProps } from './types';
import { cn } from '@/utilts/cn';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      leftIcon,
      rightIcon,
      tip,
      containerClassName,
      inputWrapperClassName,
      children,
      borderError,
      onChange,
      label,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex flex-col w-full overflow-hidden relative ',
          containerClassName,
        )}
      >
        {label && <p className='text-[15px] font-semibold mb-1'>{label}</p>}
        <div className={cn('relative', inputWrapperClassName)}>
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-white z-[1]',
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            name={props.name}
            onChange={onChange}
            onBlur={props.onBlur}
            value={props.value}
            className={cn(
              'w-full h-[44px] px-4 py-3  text-foreground placeholder:text-lighterAluminum outline-none transition border border-regaliaPurple rounded-lg',
              'disabled:bg-[#F5F5F5] disabled:cursor-not-allowed',
              (error || borderError) && 'border-[1px] border-red',
              leftIcon && 'pl-[42px]',
              tip && 'pr-12',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 text-lighterAluminum',
                {
                  'text-black': props.value,
                },
              )}
            >
              {rightIcon}
            </div>
          )}

          {children && (
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              {children}
            </div>
          )}
        </div>

        {error && <p className='text-xs text-right text-red mt-1'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
