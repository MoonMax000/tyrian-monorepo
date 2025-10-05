import Paper from '@/components/Paper';
import React, { useEffect, useState } from 'react';
import { yearFilters } from './constants';
import clsx from 'clsx';
import AreaDiagram from '@/components/Diagrams/AreaDiagram';
import { useQuery } from '@tanstack/react-query';
import { historyResponce, StocksService } from '@/services/StocksService';
import { usePathname } from 'next/navigation';

export const DATA = [
  {
    date: '2024-12-17',
    price: 400,
  },
  {
    date: 'Фев ‘24',
    price: 300,
  },
  {
    date: 'Мар ‘24',
    price: 200,
  },
  {
    date: 'Апр ‘24',
    price: 2780,
  },
  {
    date: 'Май ‘24',
    price: 189,
  },
  {
    date: 'Июнь ‘24',
    price: 239,
  },
  {
    date: 'Июль ‘24',
    price: 349,
  },
  {
    date: 'Авг ‘24',
    price: 649,
  },
  {
    date: 'Сен ‘24',
    price: 249,
  },
  {
    date: 'Окт ‘24',
    price: 376,
  },
  {
    date: 'Ноя ‘24',
    price: 399,
  },
  {
    date: 'Дек ‘24',
    price: 450,
  },
];

const StockPriceChart = () => {
  const pathname = usePathname();
  const path = pathname.split('/').pop();
  const stockSymbol = path || 'SBER';

  const [activeYearFilter, setActiveYearFilter] = useState<string>(yearFilters[0].key);
  const [dateRange, setDateRange] = useState<string>(
    `start_date=${yearFilters[0].startDate}&end_date=${yearFilters[0].endDate}`,
  );
  const [diagramData, setDiagramData] = useState<
    {
      date: string;
      price: number;
    }[]
  >(DATA);

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  const { data, refetch } = useQuery({
    queryKey: ['getHistory', stockSymbol, dateRange],
    queryFn: async () => {
      try {
        const data = await StocksService.history(stockSymbol, dateRange);
        return data;
      } catch (error) {
        console.log('Error fetching data:', error);
        return { data: [] };
      }
    },
    enabled: !!dateRange,
  });

  useEffect(() => {
    if (data?.data && data) {
      const formattedData = data.data?.map((item) => ({
        date: item.date,
        price: item.close_price,
      }));
      setDiagramData(formattedData);
    }
  }, [data]);

  // const handleYearFilterClick = (filter: {
  //   label: string;
  //   key: string;
  //   startDate: string;
  //   endDate: string;
  // }) => {
  //   setActiveYearFilter(filter.key);
  //   setDateRange(`start_date=${filter.startDate}&end_date=${filter.endDate}`);
  //   refetch();
  // };

  return (
    <Paper>
      <div className='flex items-center justify-between mb-3'>
        <h3 className='text-h4'>График котировок акций</h3>
        <div className='flex items-center gap-3'>
          {yearFilters.map((filter) => (
            <button
              key={filter.key}
              type='button'
              className={clsx('rounded-[4px] text-body-15 transition-colors w-[55px] h-[26px]', {
                'bg-purple': activeYearFilter === filter.key,
                'bg-[#FFFFFF0A]': activeYearFilter !== filter.key,
              })}
              // onClick={() => handleYearFilterClick(filter)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <AreaDiagram id='stock-price-chart' data={diagramData} className='max-h-[372px]' />
    </Paper>
  );
};

export default StockPriceChart;
