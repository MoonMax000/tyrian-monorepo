import type { FC } from 'react';
import Image from 'next/image';

import Rating from '@/components/UI/Rating';

import { getRelativeDate } from '@/helpers/get-relative-date';

export interface IReviewItem {
  user: {
    name: string;
    avatar: string;
  };
  rating: number;
  date: string;
  title: string;
  review: string;
}

export const ReviewItem: FC<IReviewItem> = ({ user, rating, date, title, review }) => {
  return (
    <div className='p-4'>
      <div className='flex items-center gap-x-2 justify-between'>
        <div className='flex items-center gap-x-2'>
          <Image
            src={user.avatar}
            alt={user.name}
            width={44}
            height={44}
            className='rounded-full'
          />
          <div className='flex flex-col gap-y-1'>
            <span className='text-[15px] font-bold hover:underline cursor-pointer'>
              {user.name}
            </span>
            <span className='text-[12px] font-bold text-lighterAluminum'>
              {getRelativeDate(date)}
            </span>
          </div>
        </div>
        <Rating
          variant='purple'
          showNumber={false}
          value={rating}
          disabled
          className='self-start'
        />
      </div>
      <div className='mt-4 text-[15px] pb-6 border-b-[1px] border-gunpowder'>
        <span className='font-bold'>{title}</span>
        <p className='inline-block text-lighterAluminum mt-2'>{review}</p>
      </div>
    </div>
  );
};
