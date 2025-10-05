'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Table, { type IColumn, type SortingState } from '@/components/UI/Table';
import PriceIndicator from '@/components/UI/PriceIndicator';
import MockChartV2 from '@/assets/mock-chart-v2.png';
import { Tabs, TabsTrigger, TabsList } from '@/components/UI/Tabs';
import { useQuery } from '@tanstack/react-query';
import { GetMarketLeadersParams, MarketLeader, StocksService } from '@/services/StocksService';
import DefaultIcon from '@/assets/defaultIcon.png';
import { getImageLink } from '@/helpers/getImageLink';
import { formatWithSuffix } from '@/utils/formatWithSuffix';
import { truncateString } from '@/utils/truncateString';
import { useRouter } from 'next/navigation';

type StockTableItem = {
  id: number;
  name: string;
  price: number;
  hourProfit: number;
  dayProfit: number;
  weekProfit: number;
  marketCap: string;
  volume: string;
  lastWeek: number;
  img: string;
  shortName: string;
};

const tabs = [
  { value: 'BASIC_MATERIALS', label: 'Basic Materials' },
  { value: 'COMMUNICATION_SERVICES', label: 'Communication Services' },
  { value: 'CONSUMER_CYCLICAL', label: 'Consumer Cyclical' },
  { value: 'CONSUMER_DEFENSIVE', label: 'Consumer Defensive' },
  { value: 'ENERGY', label: 'Energy' },
  { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'INDUSTRIALS', label: 'Industrials' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'UTILITIES', label: 'Utilities' },
];

const sortMapping: Record<string, GetMarketLeadersParams['sort_by']> = {
  hourProfit: 'change_percent_1h',
  dayProfit: 'change_percent_24h',
  weekProfit: 'change_percent_7d',
  marketCap: 'market_cap',
  volume: 'volume_24h',
  name: 'name',
};

const mapToStockTableItems = (leaders: MarketLeader[]): StockTableItem[] =>
  leaders.map((leader, idx) => ({
    id: idx,
    name: truncateString(leader.companyName, 27),
    shortName: leader.symbol,
    price: leader.price,
    hourProfit: leader.change_percent_1h ?? 0,
    dayProfit: leader.change_percent_24h,
    weekProfit: leader.change_percent_7d,
    marketCap: formatWithSuffix(leader.marketCap),
    volume: formatWithSuffix(leader.volume),
    lastWeek: 1,
    img:
      leader.icon && leader.icon.includes('company_icons')
        ? getImageLink(leader.icon)
        : DefaultIcon.src,
  }));

type Props = {
  currentFilter: string;
  country: string;
};

const StocksTable: React.FC<Props> = ({ currentFilter, country }) => {
  const [sorting, setSorting] = useState<SortingState>({});
  const [tab, setTab] = useState<string>(tabs[0].label);
  const { push } = useRouter();

  const sortKey = Object.keys(sorting)[0];
  const sortDirection = sortKey ? sorting[sortKey] : undefined;

  const getQueryFn = () => {
    const baseParams = {
      country,
      sector: tab,
      limit: 20,
      sort_by: sortMapping[sortKey],
      sort_direction: sortDirection,
    };

    if (currentFilter === 'Gainers' || currentFilter === 'Losers') {
      return () =>
        StocksService.getMarketLeadersType({
          ...baseParams,
          type: currentFilter === 'Gainers' ? 'gainers' : 'losers',
        });
    }

    return () => StocksService.getMarketLeadersGrowthFull(baseParams);
  };

  useEffect(() => setSorting({}), [currentFilter]);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['marketLeaders', currentFilter, country, tab, sorting],
    queryFn: getQueryFn(),
  });

  useEffect(() => {
    refetch();
  }, [sorting, tab, currentFilter, country, refetch]);

  const handleSort = (key: string) => {
    setSorting((prev) => {
      const currentDirection = prev[key];
      let nextDirection: 'asc' | 'desc' | undefined;

      if (!currentDirection) {
        nextDirection = 'asc';
      } else if (currentDirection === 'asc') {
        nextDirection = 'desc';
      } else {
        nextDirection = undefined;
      }

      return nextDirection ? { [key]: nextDirection } : {};
    });
  };

  const columns: IColumn<StockTableItem>[] = [
    {
      key: 'name',
      label: 'Name',
      columnClassName: 'text-left',
      rowClassName: 'text-left',
      enableSorting: true,
      renderCell: ({ name, shortName, img }) => (
        <div className='flex items-center gap-x-[10px]'>
          <Image
            src={img && img.trim() !== '' ? img : DefaultIcon.src}
            alt={name}
            width={32}
            height={32}
            className='rounded-full'
            loading='lazy'
            unoptimized
            onError={(e) => {
              console.log('Изображение не найдено:', e.currentTarget.src);
              e.currentTarget.src = DefaultIcon.src;
            }}
          />
          <div className='flex flex-col text-[12px] font-bold'>
            <span className='text-white'>{name}</span>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      ),
      onHeaderClick: () => handleSort('name'),
    },
    {
      key: 'hourProfit',
      enableSorting: true,
      label: '% 1H',
      renderCell: (item) => <PriceIndicator percentChange={item.hourProfit} />,
      onHeaderClick: () => handleSort('hourProfit'),
    },
    {
      key: 'dayProfit',
      enableSorting: true,
      label: '% 24H',
      renderCell: (item) => <PriceIndicator percentChange={item.dayProfit} />,
      onHeaderClick: () => handleSort('dayProfit'),
    },
    {
      key: 'weekProfit',
      enableSorting: true,
      label: '% 7D',
      renderCell: (item) => <PriceIndicator percentChange={item.weekProfit} />,
      onHeaderClick: () => handleSort('weekProfit'),
    },
    {
      key: 'marketCap',
      enableSorting: true,
      label: 'Market Cap',
      renderCell: (item) => item.marketCap + ' $',

      onHeaderClick: () => handleSort('marketCap'),
    },
    {
      key: 'volume',
      enableSorting: true,
      label: 'Volume (24H)',
      renderCell: (item) => item.volume + ' $',

      onHeaderClick: () => handleSort('volume'),
    },
    {
      key: 'lastWeek',
      enableSorting: false,
      label: 'Last Week',
      renderCell: (item) => <Image src={MockChartV2.src} alt={item.name} width={100} height={40} />,
    },
  ];

  const rows: StockTableItem[] = data?.data ? mapToStockTableItems(data.data) : [];
  const handleRowClick = (row: StockTableItem) => {
    push(`/stock/${row.shortName}`);
  };

  return (
    <section className='mt-12'>
      <Table
        columns={columns}
        rows={rows}
        loading={isLoading}
        rowKey='id'
        pagination={{ currentPage: 1, totalPages: 4, onChange: () => {} }}
        sorting={sorting}
        setSorting={setSorting}
        topContent={
          <Tabs defaultValue={tabs[0].value}>
            <TabsList className='border-none px-4 pt-4'>
              {tabs.map((t) => (
                <TabsTrigger
                  onClick={() => setTab(t.label)}
                  key={t.value}
                  value={t.value}
                  className='!text-[12px] font-semibold text-[#B0B0B0]  !px-0 whitespace-nowrap'
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
        containerClassName='mt-6 backdrop-blur-xl'
        onRowClick={(row) => handleRowClick(row)}
      />
    </section>
  );
};

export default StocksTable;
