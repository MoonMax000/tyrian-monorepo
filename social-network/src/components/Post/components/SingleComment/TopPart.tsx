import { FC } from 'react';
import IconPopular from '@/assets/icons/nav/popular.svg';
import IconTime from '@/assets/icons/time.svg';

type CommentSortBy = 'created_at' | 'likes_count';

interface TopPartProps {
  commentsCount?: number;
  activeFilter: CommentSortBy;
  onChangeFilter: (filter: CommentSortBy) => void;
}

export const TopPart: FC<TopPartProps> = ({ commentsCount, activeFilter, onChangeFilter }) => {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-[24px] font-semibold'>
        {commentsCount}{' '}
        {!!commentsCount ? (commentsCount > 1 ? 'comments' : 'comment') : 'Comments'}
      </h1>
      <div className='flex items-center gap-2 p-1 border border-regaliaPurple rounded-lg'>
        <button
          onClick={() => onChangeFilter('created_at')}
          className={`flex justify-center items-center size-8 rounded-[4px] 
            ${
              activeFilter === 'created_at'
                ? 'bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]'
                : 'bg-[#212329]'
            }`}
        >
          <IconTime />
        </button>

        <button
          onClick={() => onChangeFilter('likes_count')}
          className={`flex justify-center items-center size-8 rounded-[4px] 
            ${
              activeFilter === 'likes_count'
                ? 'bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]'
                : 'bg-[#212329]'
            }`}
        >
          <IconPopular />
        </button>
      </div>
    </div>
  );
};
