'use client';

import { FC } from 'react';
import { NewsModel } from '@/components/NewsBlock/constants';
import IconStar from '@/assets/icons/icon-check.svg';
import IconComments from '@/assets/icons/icon-comments.svg';
import IconReposts from '@/assets/icons/icon-reposts.svg';
import IconEmidzi from '@/assets/icons/icon-emodzi.svg';

const NewsItem: FC<{ news: NewsModel; isLast: boolean }> = ({ news, isLast }) => {
  return (
    <div
      className={`pb-6 px-6 items-center gap-[48px] ${
        isLast ? '' : 'border-b border-[#272A32]'
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <p className='text-smalltable'>{news.title}</p>
          <IconStar className='w-6 h-6' />
        </div>
        <p className='text-titletable opacity-[48%]'>{news.date}</p>
      </div>
      <p className='mb-2 text-smalltable'>{news.description}</p>
      <div className='flex items-center gap-2'>
        <div className='flex items-center gap-2 '>
          <IconComments className='w-4 h-4' />
          <span className='text-titletable opacity-50'>{news.comments}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconReposts className='w-4 h-4' />
          <span className='text-titletable opacity-50'>{news.reposts}</span>
        </div>
        <div className='flex items-center gap-2'>
          <IconEmidzi className='w-4 h-4' />
          <span className='text-titletable opacity-50'>{news.emodzi}</span>
        </div>
      </div>
    </div>
  );
};


const NewsBlock: FC<{ news: NewsModel[] }> = ({ news }) => {
  return (
    <>
      <div className='flex flex-col gap-4'>
        {news.map((item, index) => (
          <NewsItem news={item} key={item.id} isLast={index === news.length - 1} />
        ))}
      </div>
    </>
  );
};

export default NewsBlock;
