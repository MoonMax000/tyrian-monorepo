'use client';
import Button from '@/components/UI/Button/Button';
import Search from '@/components/UI/Search';
import { Select } from '@/components/UI/Select';
import { BlockTabs } from '@/components/UI/Tabs';
import { FC, useState } from 'react';
import { Option } from '@/components/UI/Select/types';
import MyMaterialsAdd from './components/Added/Added';
import Purchased from './components/Purchased/Purchased';

const MyMaterials: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { name: 'Purchased', content: <Purchased /> },
    { name: 'Added', content: <MyMaterialsAdd /> },
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
            options={[{ label: 'Type', value: 'all' }]}
            onChange={(option: Option) => onFilterChange?.('category', option.value as string)}
            value={'all'}
          />
          <Select
            options={[{ label: 'By Date', value: 'by date' }]}
            onChange={(option: Option) => onFilterChange?.('date', option.value as string)}
            value={'by date'}
          />
        </div>
        <div className='flex gap-6'>
          <Search className='min-w-64' placeholder='Search' />
          <Button className='min-w-40'>Add</Button>
        </div>
      </div>
      {tabs[activeTab].content}
    </div>
  );
};

export default MyMaterials;
