import React from 'react';
import Image from 'next/image';

export const IndexCard = () => {
  return (
    <div className='flex flex-col justify-between w-[318px] h-[84px] rounded-xl px-4 py-3 border-[1px] border-regaliaPurple'>
      <div className='flex gap-2 items-center'>
        <Image
          alt='country'
          width={24}
          height={24}
          className='rounded-full'
          src='/countries/usa.svg'
        />
        <span className='flex items-center text-[12px] font-bold text-textGray'>Nasdaq Index</span>
      </div>
      <div className='flex gap-2'>
        <span className='text-[15px] font-bold text-white'>$2,889.26</span>
        <span className='flex items-center justify-center bg-darkRed rounded-md text-red text-[12px] font-extrabold py-[2px] px-1'>
          -0.64%
        </span>
      </div>
    </div>
  );
};
