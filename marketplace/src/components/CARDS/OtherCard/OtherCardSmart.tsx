import type { FC } from 'react';

import BaseCard from '../BaseCard';

import Rating from '@/components/UI/Rating';
import TagLabel from '@/components/UI/TagLabel';
import Button from '@/components/UI/Button/Button';

import CheckIcon from '@/assets/icons/icon-check.svg';
import ChatIcon from '@/assets/icons/icon-chat.svg';
import EyeIcon from '@/assets/input/eye.svg';

type Other = {
  price: number;
  tags: string[];
  rating: number;
  reviews: number;
  views: number;
};

interface IScriptCardSmartProps {
  other: Other;
}

const ScriptCardSmart: FC<IScriptCardSmartProps> = ({ other }) => {
  const { price, tags, rating, reviews, views } = other;

  return (
    <BaseCard withTitleImg>
      <div className='p-4'>
        <span className='text-[24px] font-bold'>${price}</span>
        <ul className='flex items-center gap-2 flex-wrap mt-4'>
          {tags.map((tag) => (
            <li key={tag}>
              <TagLabel value={tag} category='none' />
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-x-4 justify-between flex-wrap mt-4'>
          <div className='flex items-center gap-x-2'>
            <Rating value={rating} showNumber={false} variant='purple' disabled />
            <span className='text-[15px] font-medium text-lighterAluminum'>
              {rating} ({reviews} reviews)
            </span>
          </div>
          <span className='flex items-center gap-x-1 text-[15px] font-medium text-lighterAluminum'>
            <EyeIcon width={16} height={16} />
            {views}
          </span>
        </div>
        <div className='flex flex-col gap-y-4 mt-6'>
          <Button className='flex items-center gap-x-2 max-h-[26px]'>
            <CheckIcon width={16} height={16} />
            Subscribe
          </Button>
          <Button className='flex items-center gap-x-2 max-h-[26px]' ghost>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
        </div>
      </div>
    </BaseCard>
  );
};

export default ScriptCardSmart;
