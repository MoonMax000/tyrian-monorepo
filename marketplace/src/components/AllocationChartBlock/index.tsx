import { FC } from 'react';
import { ChartPie } from '@/components/UI/PieChart';
import { cn } from '@/utils/cn';

export const mockPieData = [
  { name: 'IVE', value: 300, color: '#A06AFF' },
  { name: 'BTC-USD', value: 250, color: '#6AA5FF' },
  { name: 'TSLA', value: 250, color: '#FF6A79' },
  { name: 'SPY', value: 200, color: '#6AFF9C' },
  { name: 'VOO', value: 150, color: '#FFB46A' },
  { name: 'OTHERS', value: 150, color: '#8A3F66' },
];

interface Props {
  title: string;
}

export const AllocationChartBlock: FC<Props> = ({ title }) => {
  return (
    <div className=' w-full bg-[#0C101480] backdrop-blur-[100px] border border-regaliaPurple rounded-3xl'>
      <div className='w-full min-h-[58px] border-b border-сontrastLineColor p-4 text-purple text-[19px] font-bold'>
        {title}
      </div>
      <div className='flex justify-center'>
        {Array.from([0, 1, 2], (_, index) => (
          <div
            key={index}
            className={cn('flex flex-col my-4 px-4 w-[250px] border-r-[1px] border-[#2E2744]')}
          >
            <span>By Stocks:</span>
            <ChartPie data={mockPieData} />
            <div className='flex flex-col gap-2'>
              {mockPieData.map((item, index) => (
                <div key={index} className='flex gap-2 items-center'>
                  <span
                    style={{ backgroundColor: item.color }}
                    className={cn('rounded-full w-3 min-h-3 h-3')}
                  ></span>
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
