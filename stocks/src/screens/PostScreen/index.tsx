import { PercentCard } from '@/components/PercentCard/PercentCard';
import Image from 'next/image';
import { NewsBlock } from '../HomeScreen/components/Tabs/News/components/NewsBlock';
import { FC, ReactNode, useEffect } from 'react';
import './post-styles.css';

interface Props {
  title: string;
  content: ReactNode;
}

export const PostScreen: FC<Props> = ({ content, title }) => {
  return (
    <article className='flex flex-col gap-6 post-container'>
      <div className=' flex flex-col border border-regaliaPurple rounded-2xl p-4 gap-6 backdrop-blur-[100px]'>
        <Image src='/shortNews.png' alt='news-wallpaper' width={1048} height={589} />
        <div className='flex gap-4'>
          <span className='text-[12px] text-[#B0B0B0] font-bold'>
            Business DailY • Dec 26, 2024, 22:40
          </span>
          <div className='flex gap-2'>
            <PercentCard
              withLeftContent
              className='w-fit gap-2'
              leftContent='APPLE'
              children='+0.15%'
            />
            <PercentCard
              withLeftContent
              className='bg-darkRed w-fit gap-2'
              classNameText='text-red'
              leftContent='AMAZON'
              children='+0.15%'
            />
          </div>
        </div>

        <div className='flex flex-col'>
          <h1 className='font-bold text-[32px] max-w-[720px]'>
            {/* {title ? title : 'UK s Warehouse REIT agrees to Blackstones $635.35 million bid'} */}
          </h1>
          {content ? content : ''}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {Array.from([0, 1, 2], (item) => (
          <NewsBlock key={item} />
        ))}
      </div>
    </article>
  );
};
