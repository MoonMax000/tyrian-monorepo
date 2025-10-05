import { useMemo, FC } from 'react';
import clsx from 'clsx';
import QuestionIcon from '@/assets/icons/question.svg';
import LiquidationBtcRadarChart from '@/components/Diagrams/LiquidationBtcRadarChart';
import { getBrightColorFromString } from '@/helpers/getBrightColorFromString';

export type RadarChartItem = {
  category: string;
  value: number;
};

interface RadarChartCardProps {
  title: string;
  period: string;
  data: RadarChartItem[];
  className?: string;
}

const RadarChartCard: FC<RadarChartCardProps> = ({ title, period, data, className }) => {
  const transformedData = useMemo(
    () =>
      data
        .map((item) => ({ ...item, color: getBrightColorFromString(item.category) }))
        .toSorted((a, b) => b.value - a.value),
    [data],
  );

  return (
    <div className={clsx(className)}>
      <div className='flex items-center justify-between gap-x-4'>
        <div className='flex items-center gap-x-1'>
          <h3 className='text-white text-[19px] font-bold'>{title}</h3>
          <button className='text-grayLight hover:text-white'>
            <QuestionIcon />
          </button>
        </div>
        <p className='text-[15px] font-bold'>
          <span className='text-grayLight'>Period: </span>
          <span className='font-white'>{period}</span>
        </p>
      </div>
      <div className='flex items-center gap-x-12 mt-2.5'>
        <LiquidationBtcRadarChart data={transformedData} className='size-[230px]' />
        <ul className='flex flex-col gap-y-3'>
          {transformedData.map(({ category, color }) => (
            <li key={category} className='flex items-center gap-x-3 '>
              <span className='size-3 rounded-full' style={{ backgroundColor: color }} />
              <span className='text-white text-[15px] font-bold'>{category}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RadarChartCard;
