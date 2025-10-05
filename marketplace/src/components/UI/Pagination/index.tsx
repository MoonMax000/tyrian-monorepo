'use client';

import { useMemo } from 'react';
import { getPages } from './utils';
import clsx from 'clsx';
import Image from '@/components/UI/Image';

export interface IPaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (val: number) => void;
  leftArrowDisabled?: boolean;
  rightArrowDisabled?: boolean;
}

const Pagination: React.FC<IPaginationProps> = ({
  totalPages,
  currentPage,
  onChange,
  leftArrowDisabled,
  rightArrowDisabled,
}) => {
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
      <div
        className='flex items-center justify-center size-7 rounded-lg bg-custom-dark border-[1px] border-gunpowder cursor-pointer transition-all'
        onClick={() => onChange(1)}
      >
        <Image src='/arrow-double.svg' alt='arrow' className='size-[50px]' />
      </div>
      <div
        className={clsx(
          'flex items-center justify-center size-7 rounded-lg bg-custom-dark border-[1px] border-gunpowder cursor-pointer transition-all',
          {
            ' !cursor-not-allowed': leftArrowDisabled,
          },
        )}
        onClick={handleLeftArrowClick}
      >
        <Image src='/arrow.svg' alt='doubleArrow' className='size-[50px]' />
      </div>

      {pages.map((item) => (
        <div
          key={item}
          className={clsx(
            'flex items-center justify-center  size-7 rounded-lg text-[15px] text-lighterAluminum  cursor-pointer  transition-all',
            {
              'bg-gradient-to-r from-darkPurple to-lightPurple transition-all  text-white':
                item == currentPage,
              'bg-custom-dark  border-[1px] border-gunpowder': item !== currentPage,
            },
          )}
          onClick={() => onChange(item)}
        >
          {item}
        </div>
      ))}

      <div
        className={clsx(
          'flex items-center justify-center size-7 rounded-lg bg-custom-dark border-[1px] border-gunpowder cursor-pointer transition-all',
          {
            ' !cursor-not-allowed': rightArrowDisabled,
          },
        )}
        onClick={handleRightArrowClick}
      >
        <Image src='/arrow.svg' alt='arrow' className='size-[50px] rotate-180' />
      </div>
      <div
        className='bg-custom-dark border-[1px] border-gunpowder flex items-center justify-center size-7 rounded-lg cursor-pointer transition-all'
        onClick={() => onChange(totalPages)}
      >
        <Image src='/arrow-double.svg' alt='doubleArrow' className='size-[50px] rotate-180' />
      </div>
    </div>
  );
};

export default Pagination;
