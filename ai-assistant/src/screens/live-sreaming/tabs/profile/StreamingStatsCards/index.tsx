import { FC } from 'react';
import { StreamingStatsCard } from '../StreamingStatsCard';
import CartCard from '../StreamingStatsCard/ChartCard.svg';
import { RecomendationService } from '@/services/RecomendationService';
import { useQuery } from '@tanstack/react-query';

export const StreamingStatsCards: FC = () => {
  const { data: subscribesData, isLoading } = useQuery({
    queryKey: ['getSubscribers'],
    queryFn: async () => {
      const res = await RecomendationService.getSubscribers({
        page: 1,
        page_size: 10,
        sort_by: 'subscriber_count',
        sort_dir: 'asc',
      });

      return { ...res, pagination: { ...res.pagination } };
    },
  });

  const stats = [
    { title: 'Total Revenue', value: '$12,430.80', percent: 14.8 },
    {
      title: 'Active Subscribers',
      value: isLoading
        ? 'Loading...'
        : `${subscribesData?.pagination?.total_records ?? '—'}`,
      percent: 9.4,
    },
    { title: 'Top Donators', value: '342', percent: 3.7 },
  ];

  return (
    <div className='flex gap-5'>
      {stats.map((s) => (
        <StreamingStatsCard key={s.title} {...s} />
      ))}
      <CartCard />
    </div>
  );
};
