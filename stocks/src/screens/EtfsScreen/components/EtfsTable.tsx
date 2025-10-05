'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Table, { type IColumn, type SortingState } from '@/components/UI/Table';
import SwitchButtons, { type SwitchItems } from '@/components/UI/SwitchButtons';
import PriceIndicator from '@/components/UI/PriceIndicator';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';
import mockEtfsImg from '@/assets/mock-etfs.png';

type ETFS = {
  id: number;
  name: string;
  price: number;
  changes: number;
  total: number;
  shortName: string;
  img: string;
};

const columns: IColumn<ETFS>[] = [
  {
    key: 'name',
    label: 'Name',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    enableSorting: true,
    renderCell: ({ img, name, shortName }) => (
      <div className='flex items-center gap-x-[10px]'>
        <div className='flex items-center gap-x-2'>
          <Image src={img} alt={name} width={32} height={32} className='rounded-full' />
          <div className='flex flex-col gap-x-1 text-[12px] font-bold'>
            <Link href={`etfs/${shortName}`} className='text-white hover:underline'>
              {name}
            </Link>
            <span className='uppercase text-[#B0B0B0]'>{shortName}</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'price',
    renderCell: ({ price }) =>
      formatNumberWithSymbols({
        num: price,
        symbolAfter: '$',
        toFixed: 2,
      }),
    enableSorting: true,
  },
  {
    key: 'changes',
    label: 'changes',
    renderCell: ({ changes }) => <PriceIndicator percentChange={changes} />,
    enableSorting: true,
  },
  {
    key: 'total',
    label: 'Total return on net assets, 1 year',
    renderCell: ({ total }) =>
      formatNumberWithSymbols({
        num: total,
        symbolAfter: '$',
        toFixed: 2,
      }),
    enableSorting: true,
  },
];

const rows = new Array(20).fill({
  id: Math.random(),
  name: 'VanEck Defense UCITS ETF',
  shortName: 'DFEN',
  price: 342.69,
  changes: 0.11,
  total: 421.1,
  img: mockEtfsImg.src,
});

const filterValues: SwitchItems<string>[] = [
  {
    value: 'ETFs',
    label: 'All ETFs',
  },
  {
    value: 'Traded',
    label: 'Most traded',
  },
  {
    value: 'AUM Growth',
    label: 'Highest AUM growth',
  },
  {
    value: 'Returns',
    label: 'Highest returns',
  },
  {
    value: 'Dividend Yields',
    label: 'Highest dividend yields',
  },
  {
    value: 'Equity',
    label: 'Equity ETFs',
  },
  {
    value: 'Commodities',
    label: 'Commodities ETFs',
  },
  {
    value: 'Bitcoin',
    label: 'Bitcoin ETFs',
  },
  {
    value: 'Gold',
    label: 'Gold ETFs',
  },
];

const EtfsTable: React.FC = () => {
  const [filter, setFilter] = useState(filterValues[0].value);

  const [sorting, setSorting] = useState<SortingState>({});

  return (
    <section className='mt-12'>
      <SwitchButtons items={filterValues} currentValue={filter} onChange={setFilter} />
      <Table
        columns={columns}
        rows={rows}
        rowKey='id'
        pagination={{ currentPage: 1, totalPages: 4, onChange: () => {} }}
        sorting={sorting}
        setSorting={setSorting}
        containerClassName='mt-6 backdrop-blur-xl'
      />
    </section>
  );
};

export default EtfsTable;
