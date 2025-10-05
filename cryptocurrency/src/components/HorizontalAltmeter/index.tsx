import React from 'react';

interface HorizontalAltmeterProps {
  value: number;
}

const HorizontalAltmeter: React.FC<HorizontalAltmeterProps> = ({ value }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className='w-full max-w-md mx-auto relative'>
      <div className='flex justify-between text-webGray text-[12px] font-bold'>
        <span>BITCOIN SEASON</span>
        <span>ALTSEASON</span>
      </div>
      <div className='relative h-3 rounded-full overflow-hidden mt-3'>
        <div className='absolute inset-0 flex'>
          <div className='w-1/4 bg-[#ffa800]' />
          <div className='w-1/4 bg-[#ffe3ae]' />
          <div className='w-1/4 bg-[#aaccff]' />
          <div className='w-1/4 bg-[#6aa5ff]' />
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

export default HorizontalAltmeter;
