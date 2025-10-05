'use client';

import Paper from '@/components/Paper';
import NewsAggregatorList from './NewsAggregatorList';

const NewsAggregator = () => {
  return (
    <section className='flex flex-col gap-6'>
      <Paper className='!p-0 '>
        <NewsAggregatorList />
      </Paper>
    </section>
  );
};

export default NewsAggregator;
