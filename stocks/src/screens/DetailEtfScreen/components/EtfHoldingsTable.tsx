'use client';

import Image from 'next/image';
import Table, { type IColumn } from '@/components/UI/Table';
import PriceIndicator from '@/components/UI/PriceIndicator';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import metaImg from '@/assets/mock-holdings.png';

type EtfHoldingItem = {
  id: number;
  name: string;
  shortName: string;
  img: string;
  weight: number;
  shares: number;
  shareChanges: number;
  marketValue: number;
  marketValueChanges: number;
};

const columns: IColumn<EtfHoldingItem>[] = [
  {
    key: 'name',
    label: 'Symbol',
    enableSorting: true,
    rowClassName: 'text-left',
    renderCell: ({ name, shortName, img }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <Image src={img} width={32} height={32} alt={name} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <span className='text-white'>{name}</span>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'weight',
    label: 'Weight %',
    enableSorting: true,
    renderCell: ({ weight }) =>
      formatNumberWithSymbols({ num: weight, symbolAfter: '%', toFixed: 2 }),
  },
  {
    key: 'shares',
    label: 'Shares',
    enableSorting: true,
    renderCell: ({ shares }) =>
      formatNumberWithSymbols({ num: shares, toFixed: 2, symbolAfter: 'M' }),
  },
  {
    key: 'shareChanges',
    label: 'Shares CHG% 1M',
    enableSorting: true,
    renderCell: ({ shareChanges }) => <PriceIndicator percentChange={shareChanges} />,
  },
  {
    key: 'marketValue',
    label: 'Market Value',
    enableSorting: true,
    renderCell: ({ marketValue }) =>
      formatNumberWithSymbols({ num: marketValue, toFixed: 2, symbolAfter: ' в USD' }),
  },
  {
    key: 'marketValueChanges',
    label: 'Market Value CHG% 1M',
    enableSorting: true,
    renderCell: ({ marketValueChanges }) => <PriceIndicator percentChange={marketValueChanges} />,
  },
];

const rows: EtfHoldingItem[] = new Array(20).fill({
  id: Math.random(),
  name: 'Meta Platforms Inc Class A',
  shortName: 'META',
  img: metaImg.src,
  weight: 8.62,
  shares: 20.82,
  shareChanges: 0.11,
  marketValue: 4.24,
  marketValueChanges: 0.11,
});

export const EtfHoldingsTable = () => (
  <Table
    columns={columns}
    rows={rows}
    rowKey='id'
    containerClassName='!rounded-[0px] border-none'
    pagination={{ currentPage: 1, totalPages: 4, onChange: () => {} }}
  />
);
