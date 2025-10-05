'use client';

import { FC, useCallback, useLayoutEffect, useState } from 'react';
import Image from 'next/image';
import Table, { type IColumn, type SortingState } from '@/components/UI/Table';
import SwitchButtons, { type SwitchItems } from '@/components/UI/SwitchButtons';
import PriceIndicator from '@/components/UI/PriceIndicator';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import MockChartV2 from '@/assets/mock-chart-v2.png';
import { useQuery } from '@tanstack/react-query';
import { CryptoResponse, StocksService } from '@/services/StocksService';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatNumber } from '@/helpers/formatNumber';

type StockTableItem = {
  id: number;
  name: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  lastWeek: number;
  img: string;
  shortName: string;
};

const columns: IColumn<StockTableItem>[] = [
  {
    key: 'name',
    label: 'Name',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    enableSorting: true,
    renderCell: ({ img, name, shortName }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <img src={img} alt={name} width={32} height={32} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <span className='text-white'>{name}</span>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Price',
    enableSorting: true,
    renderCell: (item) => formatNumber(item.price.toFixed(2), '$'),
  },
  {
    key: 'percent_change_1h',
    enableSorting: true,
    label: '% 1H',
    renderCell: (item) => <PriceIndicator percentChange={item.percent_change_1h} />,
  },
  {
    key: 'percent_change_24h',
    enableSorting: true,
    label: '% 24H',
    renderCell: (item) => <PriceIndicator percentChange={item.percent_change_24h} />,
  },
  {
    key: 'percent_change_7d',
    enableSorting: true,
    label: '% 7D',
    renderCell: (item) => <PriceIndicator percentChange={item.percent_change_7d} />,
  },
  {
    key: 'market_cap',
    enableSorting: true,
    label: 'Market Cap',
    renderCell: (item) => formatNumber(item.market_cap.toFixed(2), '$'),
  },
  {
    key: 'volume_24h',
    enableSorting: true,
    label: 'Volume (24H)',
    renderCell: (item) => formatNumber(item.volume_24h.toFixed(2), '$'),
  },
  {
    key: 'lastWeek',
    enableSorting: true,
    label: 'Last Week',
    renderCell: (item) => <Image src={MockChartV2.src} alt={item.name} width={100} height={40} />,
  },
];

const filterValues: SwitchItems<string>[] = [
  { value: 'all', label: 'All Crypto' },
  { value: 'nfts', label: 'NFTs' },
  { value: 'rehypo', label: 'Rehypo' },
  { value: 'binance_alpha', label: 'Binance Alpha' },
  { value: 'memes', label: 'Memes' },
  { value: 'sol', label: 'SOL' },
  { value: 'bnb', label: 'BNB' },
  { value: 'internet_capital_markets', label: 'Internet Capital Markets' },
  { value: 'ai', label: 'AI' },
  { value: 'rwa', label: 'RWA' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'depin', label: 'DePIN' },
  { value: 'defai', label: 'DeFAI' },
  { value: 'ai_agents', label: 'AI Agents' },
];

interface CryptoRow {
  id: number;
  name: string;
  shortName: string;
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  chart: number;
  img: string;
}

const CryptoTable: FC = () => {
  const [page, setPage] = useState(1);
  const [sorting, setSorting] = useState<SortingState>({});

  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get('category') || 'All';

  const { data: cryptoData } = useQuery({
    queryKey: ['crypto', page, currentFilter, sorting],
    queryFn: () =>
      StocksService.crypto({
        limit: 20,
        page: page,
        category: currentFilter,
        sortBy: Object.keys(sorting)[0],
        sortDir: Object.values(sorting)[0],
      }),
  });

  const handleChangeCategory = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', newTab);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams],
  );

  const transformCryptoDataToStocksValues = (data?: CryptoResponse[]): CryptoRow[] | undefined => {
    return data?.map((item) => ({
      id: item.id,
      img: item.logo,
      shortName: item.symbol,
      name: item.name,
      price: Number(item.quote.USD.price?.toFixed(2)) ?? 0,
      percent_change_1h: Number(item.quote.USD.percent_change_1h),
      percent_change_24h: Number(item.quote.USD.percent_change_24h),
      percent_change_7d: Number(item.quote.USD.percent_change_7d),
      market_cap: Number(item.quote.USD.market_cap),
      volume_24h: Number(item.quote.USD.volume_24h),
      chart: Number(item.quote.USD.volume_change_24h),
    }));
  };

  useLayoutEffect(() => {
    if (!searchParams.has('category')) {
      const params = new URLSearchParams();
      params.set('category', 'all');
      replace(`crypto?${params}`);
    }
  }, []);

  return (
    <section className='mt-12'>
      <SwitchButtons
        items={filterValues}
        currentValue={currentFilter}
        onChange={handleChangeCategory}
      />
      <Table
        columns={columns}
        rows={
          transformCryptoDataToStocksValues(
            cryptoData?.data?.data ?? [],
          ) as unknown as StockTableItem[]
        }
        rowKey='id'
        pagination={{
          currentPage: page,
          totalPages: 5,
          onChange: (page) => setPage(page),
        }}
        sorting={sorting}
        setSorting={setSorting}
        containerClassName='mt-6 backdrop-blur-xl'
      />
    </section>
  );
};

export default CryptoTable;
