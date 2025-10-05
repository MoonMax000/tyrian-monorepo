'use client';

import ContentWrapper from '@/components/UI/ContentWrapper';
import Filter from '@/components/UI/Filter';
import Button from '@/components/UI/Button';
import IconTag from '@/assets/icons/tag.svg';
import clsx from 'clsx';
import { useState } from 'react';
import ComposedDiagramWithFiveBlockInBar, {
  ComposedDiagramDataItem,
} from '@/components/Diagrams/ComposedDiagramWithFiveBlockInBar';

const graphicData: ComposedDiagramDataItem[] = [
  {
    year: 2015,
    percent: 0.24,
    price_1: 0.11,
    price_2: 0.11,
    price_3: 0.11,
    price_4: 0.12,
    price_5: 0.47,
  },
  {
    year: 2016,
    percent: 0.32,
    price_1: 0.12,
    price_2: 0.13,
    price_3: 0.13,
    price_4: 0.13,
    price_5: 0.51,
  },
  {
    year: 2017,
    percent: 0.35,
    price_1: 0.13,
    price_2: 0.15,
    price_3: 0.15,
    price_4: 0.15,
    price_5: 0.58,
  },
  {
    year: 2018,
    percent: 0.4,
    price_1: 0.15,
    price_2: 0.16,
    price_3: 0.16,
    price_4: 0.16,
    price_5: 0.63,
  },
  {
    year: 2019,
    percent: 0.45,
    price_1: 0.16,
    price_2: 0.18,
    price_3: 0.18,
    price_4: 0.18,
    price_5: 0.7,
  },
  {
    year: 2020,
    percent: 0.48,
    price_1: 0.18,
    price_2: 0.19,
    price_3: 0.19,
    price_4: 0.19,
    price_5: 0.75,
  },
  {
    year: 2021,
    percent: 0.6,
    price_1: 0.19,
    price_2: 0.21,
    price_3: 0.21,
    price_4: 0.21,
    price_5: 0.82,
  },
  {
    year: 2022,
    percent: 1,
    price_1: 0.21,
    price_2: 0.22,
    price_3: 0.22,
    price_4: 0.22,
    price_5: 0.87,
  },
  {
    year: 2023,
    percent: 1.2,
    price_1: 0.22,
    price_2: 0.23,
    price_3: 0.23,
    price_4: 0.23,
    price_5: 0.92,
  },
  {
    year: 2024,
    percent: 1.5,
    price_1: 0.23,
    price_4: 0.24,
    price_5: 0.47,
  },
];

const viewTypes = [
  { name: '5Y', key: 'five_years' },
  { name: '10Y', key: 'ten_years' },
  { name: 'ALL', key: 'all' },
];

const DividendGraphicByYears = () => {
  const [activeFilter, setActiveFilter] = useState<string>(viewTypes[0].key);

  return (
    <ContentWrapper className='px-4 py-6'>
      <h4 className='text-h4'>Dividend Timeline and Yield by Year</h4>

      <div className='mt-2 mb-6 flex justify-between items-center'>
        <Filter options={viewTypes} active={activeFilter} onChange={setActiveFilter} />

        <Button className='w-[44px] h-[32px] flex justify-center items-center !rounded-[4px]'>
          <IconTag />
        </Button>
      </div>

      <ComposedDiagramWithFiveBlockInBar data={graphicData} height={450} />
    </ContentWrapper>
  );
};

export default DividendGraphicByYears;
