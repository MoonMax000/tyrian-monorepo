import React from 'react';
import RatingStarIcon from '@/assets/icons/icon-rating-star.svg';

type ReviewRowProps = {
  product: string;
  buyer: string;
  rating: number;
  comment: string;
  date: string;
};

export const ratingStars = Array.from({ length: 5 }, (_, i) => i + 1);

export function ReviewRow({
  product,
  buyer,
  rating,
  comment,
  date,
}: ReviewRowProps) {
  return (
    <>
      <span className='font-medium'>{buyer}</span>
      <span className='text-lighterAluminum font-medium'>{product}</span>
      <span className='flex items-center gap-1 font-medium'>
        {ratingStars.map((star) => (
          <RatingStarIcon
            key={star}
            className={`${star <= rating ? 'text-primary' : 'text-gunpowder'}`}
          />
        ))}
      </span>
      <span className='text-lighterAluminum font-medium'>{comment}</span>
      <span className='font-medium'>{date}</span>
      <div className='flex justify-center gap-2 font-medium'>
        <span className='text-primary'>View</span>
        <span className='text-white'>Hide</span>
        <span className='text-white'>Report</span>
      </div>
    </>
  );
}
