'use client';

import { forwardRef } from 'react';

import { InputProps } from './types';
import { cn } from '@/utils/cn';

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          'flex items-start justify-start  flex-col w-full overflow-hidden border-[1px] border-regaliaPurple custom-bg-blur',
          containerClassName,
        )}
      >
        <div className={cn('relative', inputWrapperClassName)}>
          {leftIcon && (
            <div className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-foreground')}>
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              'w-full h-[44px] px-4 py-3 rounded-[8px] bg-transparent text-foreground placeholder:text-webGray outline-none transition',
              ' disabled:cursor-not-allowed',
              error && 'border-[1px] border-red',
              leftIcon && 'pl-[42px]',
              tip && 'pr-12',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-webGray', {
                'text-black': props.value,
              })}
            >
              {rightIcon}
            </div>
          )}

          {children && <div className='absolute right-3 top-1/2 -translate-y-1/2'>{children}</div>}
        </div>

        {error && <p className='text-xs text-red mt-1'>{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
