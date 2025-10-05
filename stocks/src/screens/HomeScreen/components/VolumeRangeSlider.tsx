'use client';

import type { FC } from 'react';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';

interface VolumeRangeSliderProps {
  value: number;
  min: number;
  max: number;
  average: number;
  volume: number;
  currencySymbol?: string;
}

export const VolumeRangeSlider: FC<VolumeRangeSliderProps> = ({
  value,
  volume,
  min,
  max,
  average,
  currencySymbol,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const percentVsAvg = Math.round((volume / average) * 100);

  return (
    <div>
      <h3 className='text-white font-bold text-[15px] mb-6'>
        Volume:{' '}
        {formatNumberWithSymbols({
          num: volume,
          symbolAfter: 'M',
          symbolBefore: currencySymbol,
        })}
      </h3>
      <div className='relative w-full'>
        <div
          className='absolute -top-5 text-[12px] text-grayLight font-bold text-center w-[120px] pointer-events-none'
          style={{ left: `calc(${percentage}% - 60px)` }}
        >
          65 DAY AVG:{' '}
          {formatNumberWithSymbols({
            num: average,
            symbolAfter: 'M',
            symbolBefore: currencySymbol,
          })}
        </div>
        <div className='absolute h-6 left-0 top-0 text-[12px] text-grayLight font-bold pl-2 pt-1 z-[2]'>
          ({percentVsAvg}% VS AVG)
        </div>

        <div
          className='absolute rounded-[4px] z-[1] h-6 left-0 top-0 bg-[linear-gradient(90deg,_#181A20_0%,_#A06AFF_100%)]'
          style={{
            width: `calc(${percentage}% + 10px)`,
          }}
        />
        <input
          type='range'
          min={min}
          max={max}
          value={value}
          onChange={() => {}}
          className={`
              w-full h-6 appearance-none rounded-[4px] bg-transparent
              focus:outline-none
              bg-[linear-gradient(90deg,_#0B0E11_0%,_#23252D_100%)]

              [&::-webkit-slider-runnable-track]:h-3
              [&::-webkit-slider-runnable-track]:rounded-full
              [&::-webkit-slider-runnable-track]:bg-transparent
  
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:w-7
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-regaliaPurple
              [&::-webkit-slider-thumb]:border-solid
              [&::-webkit-slider-thumb]:border-[6px]
              [&::-webkit-slider-thumb]:border-[#181A20]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:translate-y-[-8px]
              [&::-webkit-slider-thumb]:relative
              [&::-webkit-slider-thumb]:z-[3]
  
              [&::-moz-range-track]:bg-transparent
              [&::-moz-range-thumb]:appearance-none
              [&::-moz-range-thumb]:h-7
              [&::-moz-range-thumb]:w-7
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-regaliaPurple
              [&::-moz-range-thumb]:border-solid
              [&::-moz-range-thumb]:border-4
              [&::-moz-range-thumb]:border-[#181A20]
              [&::-moz-range-thumb]:cursor-pointer
              [&::-moz-range-thumb]:translate-y-[-8px]
              [&::-moz-range-thumb]:relative
              [&::-moz-range-thumb]:z-[3]
            `}
        />
        <div className='flex justify-between text-[12px] text-grayLight font-bold mt-1 px-1'>
          {[min, max].map((item, i) => (
            <span key={i}>
              {formatNumberWithSymbols({
                num: item,
                symbolBefore: currencySymbol,
                toFixed: 2,
              })}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
