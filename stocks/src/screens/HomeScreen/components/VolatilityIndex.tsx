import type { FC } from 'react';
import clsx from 'clsx';
import ContentWrapper from '@/components/UI/ContentWrapper';
import VolatilityIcon from '@/assets/volatility-icon.svg';
import SpeedArrow from '@/assets/speed-arrow.svg'; // SVG как есть

interface VolatilityIndexProps {
  volatility: number;
}

const VolatilityIndex: FC<VolatilityIndexProps> = ({ volatility }) => {
  const baseRotation = 50;
  const rotation = (volatility / 100) * 180 - 90 + baseRotation;

  return (
    <ContentWrapper className='py-6 px-4 grow'>
      <div>
        <h2 className='text-[24px] font-bold mb-[10px]'>Volatility Index</h2>

        <div className='flex items-center gap-x-2'>
          <span className='text-[12px] text-grayLight uppercase'>metric: </span>
          <span
            className={clsx(
              'text-[12px] font-extrabold py-1 px-2 rounded-[4px]',
              volatility < 50 ? 'text-red bg-darkRed' : 'text-green bg-darkGreen',
            )}
          >
            {volatility}%
          </span>
        </div>
        <div className='mb-5 mt-8 relative'>
          <VolatilityIcon className='mx-auto' />
          <div
            className='absolute left-1/2 bottom-0 origin-[85%_87%] transition-transform duration-300'
            style={{ transform: `translateX(-100%) rotate(${rotation}deg)` }}
          >
            <SpeedArrow />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default VolatilityIndex;
