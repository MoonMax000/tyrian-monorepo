import React from 'react';
import RatingStarIcon from '@/assets/icons/icon-rating-star.svg';

const columnsNames = ['Buyer', 'Product', 'Rating', 'Comment'];

const rows = [
  {
    buyer: 'Jane Doe',
    product: 'Crypto Trading Signals',
    rating: 5,
    comment: 'Great signals, very profitable!',
  },
  {
    buyer: 'Jane Doe',
    product: 'Intro to Python for Finance',
    rating: 4,
    comment: 'Good course, but could use more advanced examples.',
  },
];

const ratingStars = Array.from({ length: 5 }, (_, i) => i + 1);

function LatestReview() {
  return (
    <div className='flex flex-col gap-6 w-full container-card p-4'>
      <div className='text-white font-bold text-[24px] flex items-center justify-between '>
        <span>Latest Reviews</span>
        <span className='text-[15px] font-bold text-lightPurple cursor-pointer'>
          View all
        </span>
      </div>

      <div className='grid grid-cols-[10%_20%_25%_auto] gap-y-4 text-[15px] font-[700]'>
        {columnsNames.map((name) => (
          <span
            key={name}
            className='uppercase text-lighterAluminum text-[12px] font-[700]'
          >
            {name}
          </span>
        ))}
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            <span>{row.buyer}</span>
            <span className='text-lighterAluminum'>{row.product}</span>
            <span className='flex items-center gap-1'>
              {ratingStars.map((star) => (
                <RatingStarIcon
                  key={star}
                  className={`${
                    star <= row.rating ? 'text-primary' : 'text-gunpowder'
                  }`}
                />
              ))}
            </span>
            <span className='text-lighterAluminum'>{row.comment}</span>
            {i !== rows.length - 1 && (
              <div className='col-span-4 border-t border-b border-[#181B22]'></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default LatestReview;
