import { FC } from 'react';
import { Select } from '@/components/UI/Select/Select';
import { Option } from '@/components/UI/Select/types';
import SearchInput from '@/components/SearchInput';

interface FilterControlsProps {
  onFilterChange?: (filterType: string, value: string | number) => void;
  onSearch?: (searchTerm: string) => void;
}

const FilterControls: FC<FilterControlsProps> = ({ onFilterChange }) => {
  return (
    <div className='flex gap-2 flex-wrap'>
      <Select
        options={[{ label: 'ALL', value: 'all' }]}
        onChange={(option: Option) => onFilterChange?.('category', option.value as string)}
        value={'all'}
      />
      <Select
        options={[{ label: 'CREATED', value: 'created' }]}
        onChange={(option: Option) => onFilterChange?.('created', option.value as string)}
        value={'created'}
      />
      <Select
        options={[{ label: 'ACTIVE TIME', value: 'active_time' }]}
        onChange={(option: Option) => onFilterChange?.('active_time', option.value as string)}
        value={'active_time'}
      />
      <Select
        options={[{ label: 'PNL', value: 'pnl' }]}
        onChange={(option: Option) => onFilterChange?.('pnl', option.value as string)}
        value={'pnl'}
      />
      <Select
        options={[{ label: 'MAX DRAWDOWN (7D)', value: 'max_drawdown_7d' }]}
        onChange={(option: Option) => onFilterChange?.('max_drawdown_7d', option.value as string)}
        value={'max_drawdown_7d'}
      />
      <SearchInput className='max-w-[370px] w-full ' />
      <Select
        className='w-[122px]'
        options={[{ label: 'OVERVIEW', value: 'overview' }]}
        onChange={(option: Option) => onFilterChange?.('view', option.value as string)}
        value={'overview'}
      />
    </div>
  );
};

export default FilterControls;
