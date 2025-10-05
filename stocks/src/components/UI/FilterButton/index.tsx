import clsx from 'clsx';
import { FC } from 'react';

export interface Filter {
  name: React.ReactNode;
  key: string;
}

interface FilterButtonProps {
  activeKey: string;
  filter: Filter;
  setActiveKey: (key: string) => void;
}

const FilterButton: FC<FilterButtonProps> = ({ activeKey, filter, setActiveKey }) => (
  <button
    type='button'
    className={clsx(
      'px-4 h-[32px] rounded-[4px] transition-colors text-body-15 font-bold text-white items-center flex justify-center',
      {
        'bg-purple': activeKey === filter.key,
        'bg-[#FFFFFF0A] opacity-45': activeKey !== filter.key,
      },
    )}
    onClick={() => setActiveKey(filter.key)}
  >
    {filter.name}
  </button>
);

export default FilterButton;
