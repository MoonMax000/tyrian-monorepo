'use client';

import { useState, useMemo, type FC } from 'react';
import Filter, { type FilterOption } from '@/components/UI/Filter';
import ChevronDown from '@/assets/icons/chevron-down.svg';
import { getBrightColorFromString } from '@/helpers/getBrightColorFromString';
import YearComposedDiagram from '@/components/Diagrams/YearComposedDiagram';

type DataItem = {
  month: string;
  year: string;
  [key: `price_${string}`]: number;
};

interface StockComparisonCardProps {
  data: DataItem[];
  title: string;
  options: FilterOption[];
  initialFilter?: string;
  mapTotalValue?: (value: number) => string;
  className?: string;
  yAxisSymbol?: string;
}

export const StockComparisonCard: FC<StockComparisonCardProps> = ({
  data,
  title,
  options,
  initialFilter,
  mapTotalValue,
  yAxisSymbol = '$',
  className,
}) => {
  const [filter, setFilter] = useState<string>(initialFilter ?? options[0].key ?? '');

  const maxValues = useMemo(() => {
    const values: Record<string, number> = {};
    if (!data.length) {
      return values;
    }
    const keys = Object.keys(data[0]);

    keys.forEach((key) => {
      if (key.startsWith('price')) {
        const subject = key.split('_')[1];
        const maxValue = Math.max(...data.map((item) => item[key as keyof typeof item] as number));
        values[subject] = maxValue;
      }
    });

    return values;
  }, [data]);

  return (
    <div className={className}>
      <div className='flex items-center gap-x-40'>
        <div className='flex items-center gap-x-1.5'>
          <span className='text-white text-[15px] font-bold'>{title}</span>
          <ChevronDown className='rotate-180' />
        </div>
        <ul className='flex items-center gap-x-40'>
          {Object.values(maxValues).map((value, index) => (
            <li key={value + index} className='text-[15px] font-bold text-white'>
              <span>{mapTotalValue ? mapTotalValue(value) : value}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex items-center gap-x-4 justify-between'>
        <div className='flex items-center gap-x-4'>
          {Object.keys(maxValues).map((key) => (
            <div key={key} className='flex items-center gap-x-1.5'>
              <div
                className='size-2 rounded-full'
                style={{ backgroundColor: getBrightColorFromString(key) }}
              />
              <span className='text-[15px] font-bold text-white uppercase'>{key}</span>
            </div>
          ))}
        </div>
        {options.length && <Filter options={options} active={filter} onChange={setFilter} />}
      </div>
      <YearComposedDiagram
        data={data}
        id={`year-composed-diagram-${title}`}
        margin={{
          top: 20,
          bottom: 20,
          left: 0,
          right: 20,
        }}
        yAxisDx={10}
        currencySymbol={yAxisSymbol}
      />
    </div>
  );
};
