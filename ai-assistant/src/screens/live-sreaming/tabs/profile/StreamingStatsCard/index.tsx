import { IndicatorTag } from '@/components/ui/IndicatorTag/IndicatorTag';
import Paper from '@/components/ui/Paper/Paper';
import { FC } from 'react';

interface StreamingStatsCardProps {
  title: string;
  value: string;
  percent: number;
}

export const StreamingStatsCard: FC<StreamingStatsCardProps> = ({
  title,
  value,
  percent,
}) => {
  const isPositive = percent >= 0;

  return (
    <Paper className='p-4 flex flex-col gap-[29.75px] min-w-[246px]'>
      <div>
        <p className='text-xs text-lighterAluminum font-medium uppercase'>
          {title}
        </p>
        <h3 className='text-2xl font-semibold'>{value}</h3>
      </div>
      <div className='flex items-center gap-2'>
        <IndicatorTag
          className='rounded-md py-[2px] px-1 text-xs'
          type={isPositive ? 'darckGreen' : 'red'}
        >
          {isPositive ? `+${percent}%` : `${percent}%`}
        </IndicatorTag>
        <span className='text-lightPurple text-sm font-medium'>
          VS LAST MONTH
        </span>
      </div>
    </Paper>
  );
};
