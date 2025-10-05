'use client';

import { useMemo } from 'react';
import clsx from 'clsx';

import Image from '../Image';
import { getPages } from './utils';

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (val: number) => void;
}

const Pagination: React.FC<IPaginationProps> = ({ totalPages, currentPage, onChange }) => {
  const pages = useMemo(() => {
    return getPages(currentPage, 11, totalPages);
  }, [currentPage, totalPages]);

  if ([1, 0].includes(totalPages)) {
    return null;
  }

  return (
    <div className='flex gap-[5px] select-none'>
      <div
        className='flex items-center justify-center size-11 rounded-md bg-moonlessNight cursor-pointer hover:bg-[#FFFFFF20]'
        onClick={() => onChange(1)}
      >
        <Image src='/arrow-double.svg' alt='arrow' className='size-[14px]' />
      </div>
      <div
        className='flex items-center justify-center size-11 rounded-md bg-moonlessNight cursor-pointer hover:bg-[#FFFFFF20]'
        onClick={() => onChange(Math.max(1, currentPage - 1))}
      >
        <Image src='/arrow.svg' alt='doubleArrow' className='size-[14px]' />
      </div>

      {pages.map((item) => (
        <div
          key={item}
          className={clsx(
            'flex items-center justify-center size-11 rounded-md text-body-15 text-[#808283] cursor-pointer bg-moonlessNight hover:bg-[#FFFFFF20] hover:text-white',
            {
              'transition-all text-white !bg-purple hover:text-white': item === currentPage,
            },
          )}
          onClick={() => onChange(item)}
        >
          {item}
        </div>
      ))}

      <div
        className='flex items-center justify-center size-11 rounded-md bg-moonlessNight cursor-pointer hover:bg-[#FFFFFF20]'
        onClick={() => onChange(Math.min(currentPage + 1, totalPages))}
      >
        <Image src='/arrow.svg' alt='arrow' className='size-[14px] rotate-180' />
      </div>
      <div
        className='flex items-center justify-center size-11 rounded-md bg-moonlessNight cursor-pointer hover:bg-[#FFFFFF20]'
        onClick={() => onChange(totalPages)}
      >
        <Image src='/arrow-double.svg' alt='doubleArrow' className='size-[14px] rotate-180' />
      </div>
    </div>
  );
};

export default Pagination;
