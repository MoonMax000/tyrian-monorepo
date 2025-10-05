import Button from '@/components/UI/Button';
import ButtonGroup from '@/components/UI/ButtonGroup';
import Paper from '@/components/UI/Paper';
import React, { useState } from 'react';
import OverviewContent from './OverviewContent';
import DetailsContent from './DetailsContent';
import { TimeRange } from '@/components/Diagrams/types';
import Filter from '@/components/UI/Filter';

const buttons: { label: string; value: TimeRange }[] = [
  { label: '1M', value: '1M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

const variants = [
  { label: 'OVERVIEW', value: 'overview' },
  { label: 'BREAKDOWN', value: 'breakdown' },
]

const MarketCapitalization = () => {
  const [activeButton, setActiveButton] = useState<TimeRange>(buttons[0].value);
  const [contentType, setContentType] = useState<string>(variants[0].value);

  return (
    <Paper className='flex flex-col gap-6 h-[581px] w-[859px]'>
      <div className='flex justify-between items-center'>
        <h3 className='font-bold text-2xl'>Crypto Cap</h3>
        <div className='flex gap-[16px]'>
          <Filter options={variants} active={contentType} onChange={setContentType}/>
          <Filter options={buttons} active={activeButton} onChange={(value) => setActiveButton(value as TimeRange)}/>
        </div>
      </div>

      <div className='flex-1 overflow-hidden'>
        {contentType === 'overview' ? (
          <OverviewContent timeRange={activeButton} />
        ) : (
          <DetailsContent timeRange={activeButton} />
        )}
      </div>
    </Paper>
  );
};

export default MarketCapitalization;
