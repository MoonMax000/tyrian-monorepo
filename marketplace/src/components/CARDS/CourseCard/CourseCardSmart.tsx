import type { FC } from 'react';
import Rating from '@/components/UI/Rating';
import TagLabel from '@/components/UI/TagLabel';
import Button from '@/components/UI/Button/Button';
import VideoPreview from '@/components/UI/VideoPreview';
import Paper from '@/components/UI/Paper';
import List from '@/components/UI/List';

import ChatIcon from '@/assets/icons/icon-chat.svg';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import ClockIcon from '@/assets/icons/icon-clock.svg';
import CheckIcon from '@/assets/icons/icon-check.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';
import handImg from '@/assets/hand.jpg';

type Tag = {
  value: string;
  category: 'good' | 'midle' | 'some' | 'none' | 'strange';
};

type Course = {
  defaultPrice: number;
  currentPrice: number;
  topTags: Tag[];
  listTags: string[];
  rating: number;
  sales: number;
  reviews: number;
  bottomTags: Tag[];
};

interface ICourseCardSmartProps {
  course: Course;
}

const CourseCardSmart: FC<ICourseCardSmartProps> = ({ course }) => {
  const { defaultPrice, currentPrice, topTags, bottomTags, listTags, rating, sales, reviews } =
    course;

  const sale = ((defaultPrice - currentPrice) / defaultPrice) * 100;

  return (
    <Paper className='overflow-hidden'>
      <VideoPreview src={handImg.src} />
      <div className='p-4'>
        <div className='flex items-center gap-x-2'>
          <span className='text-[24px] font-bold'>${currentPrice}</span>
          <span className='text-[15px] font-medium text-lighterAluminum line-through'>
            ${defaultPrice}
          </span>
          <span className='inline-block text-[12px] font-bold uppercase bg-darkGreen text-green px-1 py-1/2 rounded-[4px]'>
            {sale.toFixed(0)}% OFF
          </span>
        </div>
        <ul className='flex items-center gap-2 flex-wrap mt-4'>
          {topTags.map((tag) => (
            <li key={tag.value}>
              <TagLabel {...tag} />
            </li>
          ))}
        </ul>
        <div className='flex flex-col gap-y-4 mt-4'>
          <span className='flex items-center gap-x-2 text-purple font-bold text-[15px]'>
            <ClockIcon width={16} height={16} />
            Limited time offer: 2 days left
          </span>
          <span className='text-lighterAluminum font-medium text-[15px]'>
            P2P Crypto Arbitrage from Scratch!
          </span>
        </div>
        <List list={listTags} Icon={CheckIcon} className='mt-6' />
        <div className='flex items-center gap-x-4 justify-between flex-wrap mt-4'>
          <div className='flex items-center gap-x-2'>
            <Rating value={rating} showNumber={false} variant='purple' disabled />
            <span className='text-[15px] font-medium text-lighterAluminum'>
              {rating} ({reviews} reviews)
            </span>
          </div>
          <span className='flex items-center gap-x-1 text-[15px] font-medium text-lighterAluminum'>
            {sales} sales
          </span>
        </div>
        <ul className='flex items-center gap-2 flex-wrap mt-8'>
          {bottomTags.map((tag) => (
            <li key={tag.value}>
              <TagLabel {...tag} />
            </li>
          ))}
        </ul>
        <div className='flex flex-col gap-y-4 mt-6'>
          <Button className='flex items-center gap-x-2 max-h-[26px]'>
            <BuyIcon width={16} height={16} />
            Subscribe
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <LearnMoreIcon />
            Live Preview
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default CourseCardSmart;
