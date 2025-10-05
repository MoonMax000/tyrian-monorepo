'use client';

import { useState, type FC } from 'react';
import Image from 'next/image';

import DescriptionCard from '@/components/UI/DescriptionCard';
import Table, { type IColumn } from '@/components/UI/TableV2';
import ProcentLabel from '@/components/UI/ProcentLabel';

type PortfolioItem = {
  companyName: string;
  companyShortName: string;
  companyImg: string;
  hold: number;
  returnNum: number;
  trnx: number;
  lastTrnx: string;
  date: string;
};

const columns: IColumn<PortfolioItem>[] = [
  {
    label: 'company',
    key: 'companyName',
    columnClassName: 'text-left',
    rowClassName: 'text-left',
    renderCell: ({ companyName, companyImg, companyShortName }) => (
      <div className='flex items-center gap-x-2'>
        <Image src={companyImg} width={40} height={40} className='rounded-full' alt={companyName} />
        <div className='flex flex-col gap-y-1 font-bold'>
          <span className='text-[15px] uppercase'>{companyShortName}</span>
          <span className='text-[12px] text-lighterAluminum'>{companyName}</span>
        </div>
      </div>
    ),
  },
  {
    label: '% Hold',
    key: 'hold',
    renderCell: ({ hold }) => `${hold}%`,
    rowClassName: 'text-center',
    columnClassName: 'text-center',
  },
  {
    key: 'returnNum',
    label: 'Return',
    renderCell: ({ returnNum }) => <ProcentLabel value={returnNum} border toFixed={2} />,
    rowClassName: 'text-center',
    columnClassName: 'text-center',
  },
  {
    key: 'trnx',
    label: '№ of trnx',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
  },
  {
    key: 'lastTrnx',
    label: 'Last Trnx',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
  },
  {
    key: 'date',
    label: 'Date',
    renderCell: ({ date }) => new Date(date).toLocaleDateString(),
  },
];

interface PortfolioTableProps {
  portfolioName: string;
  data: PortfolioItem[];
  loading?: boolean;
  error?: Error | null;
}

export const PortfolioTable: FC<PortfolioTableProps> = ({
  portfolioName,
  data,
  loading = false,
  error = null,
}) => {
  const [page, setPage] = useState(1);

  return (
    <DescriptionCard
      title={`${portfolioName}: Stock Buying and Selling in Portfolio`}
      contentClassName='!p-0'
    >
      <Table
        columns={columns}
        rows={data}
        loading={loading}
        error={error?.message}
        rowKey={(_, i) => i.toString()}
        pagination={{
          currentPage: page,
          onChange: setPage,
          totalPages: 3,
        }}
        containerClassName='!rounded-none'
      />
    </DescriptionCard>
  );
};
