import { FC } from 'react';

import Paper from '@/components/UI/Paper';
import Rating from '@/components/UI/Rating';
import Button from '../UI/Button/Button';

import { ReviewItem, type IReviewItem } from './ReviewItem';

interface IReviewListProps {
  avgAssessment: number;
  reviews: IReviewItem[];
  allReviewsCount: number;
}

const Reviews: FC<IReviewListProps> = ({ avgAssessment, reviews, allReviewsCount }) => {
  return (
    <Paper>
      <div className='p-4 border-b-[1px] border-gunpowder'>
        <h3 className='text-[19px] text-purple font-bold'>Reviews</h3>
        <div className='flex items-center gap-x-4 mt-4'>
          <span className='text-[31px] text-purple font-bold'>{avgAssessment}</span>
          <div className='flex flex-col gap-y-1'>
            <Rating variant='purple' showNumber={false} value={avgAssessment} disabled />
            <span className='text-[12px] font-bold text-lighterAluminum'>
              Based on {allReviewsCount} reviews
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col'>
        {reviews.map((review, index) => (
          <ReviewItem key={index} {...review} />
        ))}
      </div>
      <div className='p-4'>
        <Button ghost className='w-full max-h-[26px] mt-4'>
          Show More Reviews
        </Button>
      </div>
    </Paper>
  );
};

export default Reviews;
