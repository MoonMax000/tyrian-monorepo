import Paper from '@/components/Paper';
import { FC } from 'react';

type ChartDisplayProps = {
  chartItem: {
    name: string;
    price: string;
  };
};

const ChartDisplay: FC<ChartDisplayProps> = ({ chartItem }) => {
  return (
    <Paper className='!flex flex-col gap-4 border-[2px] border-onyxGrey h-full transition-colors hover:bg-purple hover:border-transparent [&>p]:hover:first:opacity-100 cursor-pointer'>
      <p className='text-body-12 opacity-40 transition-colors'>{chartItem.name}</p>
      <p className='text-body-12'>{chartItem.price}</p>
    </Paper>
  );
};

export default ChartDisplay;
