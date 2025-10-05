import React from 'react';

interface HorizontalGreedometerProps {
  value: number;
}

const HorizontalGreedometer: React.FC<HorizontalGreedometerProps> = ({ value }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className='w-full max-w-md mx-auto relative'>
      <div className='flex justify-between text-webGray font-bold text-[12px]'>
        <span>FEAR</span>
        <span>GREED</span>
      </div>

      <div className='relative h-3 rounded-full overflow-hidden mt-3 bg-gray-300'>
        <div className='absolute inset-0 flex'>
          <div className='w-1/5 bg-[#FFB96A]' />
          <div className='w-1/5 bg-[#6AFFD0]' />
          <div className='w-1/5 bg-[#6AD2FF]' />
          <div className='w-1/5 bg-[#6AA6FF]' />
          <div className='w-1/5 bg-[#A06AFF]' />
        </div>

        <div
          className='absolute top-1/2 -translate-x-1/2 -translate-y-1/2 size-5 bg-white rounded-full border-[5px] border-blackedGray'
          style={{
            left: `${clampedValue}%`,
          }}
        />
      </div>

      <div
        className='absolute bottom-5 font-semibold text-white -translate-x-1/2'
        style={{ left: `${clampedValue}%` }}
      >
        {clampedValue}
      </div>
    </div>
  );
};

export default HorizontalGreedometer;
