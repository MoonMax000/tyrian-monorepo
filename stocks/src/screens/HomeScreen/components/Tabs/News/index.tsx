import React, { useEffect, useState } from 'react';
import Pagination from '@/components/UI/Pagination';
import { NewsBlock } from './components/NewsBlock';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';

export const NewsTab = () => {
  const [page, setPage] = useState(0);

  const { data: news } = useQuery({
    queryKey: ['stocks-news'],
    queryFn: () => StocksService.news(),
  });

  return (
    <div className='flex flex-col gap-5 items-center'>
      {Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8], (index) => (
        <NewsBlock key={index} /> // news -п
      ))}
      <div className='mt-10'>
        <Pagination currentPage={page} onChange={setPage} totalPages={8} />
      </div>
    </div>
  );
};
