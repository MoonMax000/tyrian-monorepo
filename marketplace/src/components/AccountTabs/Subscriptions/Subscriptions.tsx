'use client';

import Search from '@/components/UI/Search';
import { Select } from '@/components/UI/Select';
import { BlockTabs } from '@/components/UI/Tabs';
import { FC, useState } from 'react';
import { Option } from '@/components/UI/Select/types';
import History from './components/Histoy/Histoy';
import Active from './components/Active/Active';

const Subscriptions: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Active', content: <Active /> },
    { name: 'History', content: <History /> },
  ];
  const onFilterChange = (filterType: string, value: string | number) => {
    console.log(`Filter changed: ${filterType} = ${value}`);
  };

  return (
    <div className='flex flex-col gap-8'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-4'>
          <BlockTabs tabs={tabs} setActiveTab={setActiveTab} activeTab={activeTab} />
          <Select
            options={[{ label: 'ALL', value: 'all' }]}
            onChange={(option: Option) => onFilterChange?.('category', option.value as string)}
            value={'all'}
            className='w-[184px]'
          />
          <Select
            options={[{ label: 'By Date', value: 'by date' }]}
            onChange={(option: Option) => onFilterChange?.('date', option.value as string)}
            value={'by date'}
            className='w-[184px]'
          />
        </div>

        <Search className='min-w-[335px]' placeholder='Search' />
      </div>
      {tabs[activeTab].content}
    </div>
  );
};

export default Subscriptions;
