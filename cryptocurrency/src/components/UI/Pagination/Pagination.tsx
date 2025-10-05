'use client';

import { useMemo } from 'react';
import { getPages } from './utils';
import clsx from 'clsx';
import Image from '@/components/UI/Image';

interface IProps {
  totalPages: number;
  currentPage: number;
  onChange: (val: number) => void;
  leftArrowDisabled?: boolean;
  rightArrowDisabled?: boolean;
}

const Pagination: React.FC<IProps> = ({ totalPages, currentPage, onChange, leftArrowDisabled, rightArrowDisabled }) => {
  const pages = useMemo(() => {
    return getPages(currentPage, 4, totalPages);
  }, [currentPage, totalPages]);

  const handleLeftArrowClick = () => {
    if (!leftArrowDisabled) {
      onChange(Math.max(1, currentPage - 1));
    }
  };

  const handleRightArrowClick = () => {
    if (!rightArrowDisabled) {
      onChange(Math.min(currentPage + 1, totalPages));
    }
  };

  // if (totalPages === 1) {
  //   return null;
  // }

  return (
    <div className='flex justify-end gap-[5px] pr-6 py-2 select-none'>
      {/* <div
        className='flex items-center justify-center size-8 rounded-md bg-lightGray cursor-pointer transition-all'
        onClick={() => onChange(1)}
      >
        <Image src='/arrow-double.svg' alt='arrow' className='size-[14px]' />
      </div> */}
      <div
        className={clsx('flex items-center justify-center size-8 rounded-md bg-lightGray cursor-pointer transition-all', {
          'opacity-50 !cursor-not-allowed': leftArrowDisabled,
        })}
        onClick={handleLeftArrowClick}
      >
        <Image src='/arrow.svg' alt='doubleArrow' className='size-[14px]' />
      </div>

      {pages.map((item) => (
        <div
          key={item}
          className={clsx(
            'flex items-center justify-center size-8 rounded-md text-[14px] text-white font-semibold text-opacity-20 font-medium cursor-pointer bg-lightGray transition-all',
            {
              'bg-purple text-opacity-[100%] transition-all text-opacity-100 text-white': item == currentPage,
            },
          )}
          onClick={() => onChange(item)}
        >
          {item}
        </div>
      ))}

      <div
        className={clsx('flex items-center justify-center size-8 rounded-md bg-lightGray cursor-pointer transition-all', {
          'opacity-50 !cursor-not-allowed': rightArrowDisabled,
        })}
        onClick={handleRightArrowClick}
      >
        <Image src='/arrow.svg' alt='arrow' className='size-[14px] rotate-180' />
      </div>
      {/* <div
        className='flex items-center justify-center size-8 rounded-md bg-lightGray cursor-pointer transition-all'
        onClick={() => onChange(totalPages)}
      >
        <Image src='/arrow-double.svg' alt='doubleArrow' className='size-[14px] rotate-180' />
      </div> */}
    </div>
  );
};

export default Pagination;
