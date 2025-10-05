'use client';

import { useMemo, useState, type FC } from 'react';
import clsx from 'clsx';

import Star from '@/assets/icons/icon-star.svg';

import { clampValue, fillFor, pickByPointer } from './lib/utils';

const VARIANTS = {
  default: {
    fillInactiveClassName: 'fill-none',
    fillActiveClassName: 'fill-orange',
    strokeClassName: 'text-orange',
  },
  purple: {
    fillInactiveClassName: 'fill-gunpowder',
    fillActiveClassName: 'fill-purple',
    strokeClassName: 'text-transparent',
  },
};

interface IRatingProps {
  max?: number;
  value?: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
  size?: number;
  showNumber?: boolean;
  variant?: 'default' | 'purple';
  className?: string;
}

const Rating: FC<IRatingProps> = ({
  max = 5,
  value,
  onChange,
  disabled = false,
  size = 16,
  showNumber = true,
  variant = 'default',
  className,
}) => {
  const [internal, setInternal] = useState<number>(value ?? 0);
  const current = value ?? internal;
  const [hover, setHover] = useState<number | null>(null);

  const display = hover ?? current;
  const clampedDisplay = useMemo(() => clampValue(display, max), [display, max]);

  const setValue = (v: number) => {
    const next = clampValue(v, max);
    if (onChange) onChange(next);
    else setInternal(next);
  };

  const { strokeClassName, fillInactiveClassName, fillActiveClassName } = VARIANTS[variant];

  return (
    <div className={clsx('inline-flex items-center gap-2', className)}>
      <div className='flex'>
        {Array.from({ length: max }).map((_, i) => {
          const percent = fillFor(i, clampedDisplay);

          const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            const v = pickByPointer(e, i);
            const rounded = Math.round(v * 2) / 2;
            setHover(rounded);
          };

          const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            const v = pickByPointer(e, i);
            const rounded = Math.round(v * 2) / 2;
            setValue(rounded);
          };

          return (
            <button
              key={i}
              type='button'
              className='relative pr-[2px] last:pr-0'
              style={{ width: size, height: size }}
              aria-label={`Set rating to ${i + 1}`}
              disabled={disabled}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => !disabled && setHover(null)}
              onClick={handleClick}
            >
              <Star
                width={size}
                height={size}
                className={clsx(strokeClassName, fillInactiveClassName)}
              />
              <div
                className='absolute inset-0 overflow-hidden pointer-events-none'
                style={{ width: `${percent}%` }}
              >
                <Star
                  width={size}
                  height={size}
                  className={clsx(strokeClassName, fillActiveClassName)}
                />
              </div>
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className='text-green font-bold text-[15px] tabular-nums'>
          {(Math.round(current * 2) / 2).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
