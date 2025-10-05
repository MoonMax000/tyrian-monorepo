import Link from 'next/link';
import { FC } from 'react';
import { NewsModel } from '../constants';
import { StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';

export const NewsItem: FC<{ news: NewsModel }> = ({ news }) => {
  return (
    <Link
      href={`/news/${news.id}`}
      className='pb-6 border-b border-[#272A32] grid grid-cols-[135px,auto] items-center gap-[48px]'
    >
      <p className='text-body-15 opacity-[48%]'>{news.date}</p>
      <p className='text-body-15 hover:text-purple hover:underline'>{news.title}</p>
    </Link>
  );
};

const NewsBlock: FC<{ news: NewsModel[] }> = ({}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['GetNews'],
    queryFn: () =>
      StocksService.news().then((response) =>
        response.data.map((item, index) => ({
          id: index + 1,
          date: new Date(item.published_at).toLocaleDateString(),
          title: item.title,
        })),
      ),
  });

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  if (isError) {
    return <p className='text-red-500'>Error loading news.</p>;
  }

  return (
    <>
      <div className='flex items-center gap-7'>
        <h4 className='text-h4'>Latest News</h4>
        <Link
          href='/market-news'
          className='text-body-15 underline underline-offset-2 text-purple'
        >
          All News
        </Link>
      </div>

      <div className='mt-8 flex flex-col gap-6'>
        {data?.slice(0, 5).map((item: NewsModel) => <NewsItem news={item} key={item.id} />)}
      </div>
    </>
  );
};

export default NewsBlock;
