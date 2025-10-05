import { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';
import RadarChartCard from '@/components/RadarChartCard';

export const mockSourceGraphicData = [
  { category: 'IT', value: 900 },
  { category: 'Data Storage', value: 500 },
  { category: 'Data Science', value: 0 },
  { category: 'DevOps', value: 0 },
  { category: 'Engineering', value: 0 },
];
export const mockCountryGraphicData = [
  { category: 'USA', value: 900 },
  { category: 'Other Countries', value: 800 },
  { category: 'China', value: 700 },
  { category: 'India', value: 0 },
  { category: 'Japan', value: 0 },
];

export const RevenueAnalysis: FC = () => {
  return (
    <ContentWrapper className='!p-0 mt-6'>
      <div className='px-[23px] pt-6 pb-4 border-b-2  border-gunpowder'>
        <h3 className='text-h4 '>Revenue analysis</h3>
        <p className='text-body-15 opacity-65'>Revenue sources and Geographic Segments</p>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-x-4 py-6 px-4'>
        <RadarChartCard
          title='Source / Business Line'
          period='2023'
          data={mockSourceGraphicData}
          className='grow border-b-2 lg:border-r-2 lg:border-b-0 border-gunpowder lg:pr-[27px]'
        />
        <RadarChartCard
          title='Geographic Segments'
          period='2023'
          data={mockCountryGraphicData}
          className='grow mt-4 lg:mt-0'
        />
      </div>
    </ContentWrapper>
  );
};
