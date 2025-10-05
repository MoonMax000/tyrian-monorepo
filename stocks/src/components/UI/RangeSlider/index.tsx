'use client';

import type { FC, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';

interface RangeSliderProps extends InputHTMLAttributes<Omit<HTMLInputElement, 'type'>> {
  min: number;
  max: number;
  value: number;
}

const RangeSlider: FC<RangeSliderProps> = ({ className, min, max, value, ...props }) => {
  return (
    <div className={clsx('flex items-center gap-x-[21px]', className)}>
      <span className='text-[15px] font-bold'>
        {formatNumberWithSymbols({
          num: min,
          symbolBefore: '$',
          toFixed: 2,
        })}
      </span>
      <input
        {...props}
        type='range'
        min={min}
        max={max}
        value={value}
        className={clsx(
          'w-full h-4 appearance-none bg-transparent',
          '[&::-webkit-slider-runnable-track]:h-[2px]',
          '[&::-webkit-slider-runnable-track]:bg-[#313338]',
          '[&::-webkit-slider-thumb]:appearance-none',
          '[&::-webkit-slider-thumb]:size-4',
          '[&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:bg-purple',
          '[&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:-translate-y-1/2',
          '[&::-webkit-slider-thumb]:disabled:cursor-not-allowed',
          '[&::-moz-range-track]:h-[2px]',
          '[&::-moz-range-track]:bg-[#313338]',
          '[&::-moz-range-thumb]:appearance-none',
          '[&::-moz-range-thumb]:size-4',
          '[&::-moz-range-thumb]:rounded-full',
          '[&::-moz-range-thumb]:bg-purple',
          '[&::-moz-range-thumb]:cursor-pointer',
          '[&::-moz-range-thumb]:-translate-y-1/2',
          '[&::-moz-range-thumb]:disabled:cursor-not-allowed',
        )}
      />
      <span className='text-[15px] font-bold'>
        {formatNumberWithSymbols({
          num: max,
          symbolBefore: '$',
          toFixed: 2,
        })}
      </span>
    </div>
  );
};

export default RangeSlider;
