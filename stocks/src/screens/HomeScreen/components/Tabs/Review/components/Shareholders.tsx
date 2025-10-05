'use client';

import ContentWrapper from '@/components/UI/ContentWrapper';
import Loaders from '@/components/UI/Skeleton';
import Table, { type IColumn } from '@/components/UI/Table';
import { StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import QuestionIcon from '@/assets/icons/question.svg';

export const headersShareholders = [
  { name: 'Name', key: 'holder' },
  { name: 'Stake', key: 'sharesPercent' },
  { name: 'Shares Held', key: 'shares' },
  { name: 'Value', key: 'value' },
  { name: 'type', key: 'holderType' },
];

export const shareHoldersChartMockData = {
  institutional: 345,
  insiders: 30,
  retail: 345,
};

interface formattedTableData {
  holder: string;
  sharesPercent: string;
  shares: string;
  value: string;
  holderType: string;
}

const columns: IColumn<{
  holder: string;
  sharesPercent: string;
  shares: string;
  value: string;
  holderType: string;
}>[] = [
  { key: 'holder', label: 'Name', columnClassName: 'text-left', rowClassName: 'text-left' },
  { key: 'sharesPercent', label: 'Stake' },
  { key: 'shares', label: 'Shares Held' },
  { key: 'value', label: 'Value' },
  { key: 'holderType', label: 'Type' },
];

export const Shareholders = () => {
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  const ticker = pathname.split('/').pop() || '';
  const [tableData, setTableData] = useState<formattedTableData[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['holdersTable', ticker],
    queryFn: () => StocksService.holdersTable('us', ticker),
    staleTime: 60000,
    enabled: !!ticker,
  });

  useEffect(() => {
    if (data) {
      const formattedData: formattedTableData[] = data.data.map((item) => ({
        holder: formatHolderName(item.holder),
        sharesPercent: `${item.sharesPercent.toFixed(2)}%`,
        shares: formatNumberWithCommas(item.shares),
        value: formatCurrency(item.value),
        holderType: item.holderType,
      }));
      setTableData(formattedData);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  }, [error]);

  const formatHolderName = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString('en-US');
  };

  const formatCurrency = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toLocaleString('en-US')}`;
    }
  };

  const getShareholderChartWidth = (key: keyof typeof shareHoldersChartMockData) => {
    const total = Object.values(shareHoldersChartMockData).reduce((sum, value) => sum + value, 0);
    const value = shareHoldersChartMockData[key];

    if (total === 0 || value === undefined) return 0;

    return (value / total) * 100;
  };

  return (
    <>
      {isLoading ? (
        <Loaders className='w-full h-96' />
      ) : (
        <ContentWrapper className='py-6'>
          <div className='flex gap-x-[6px] items-center px-4'>
            <h2 className='text-[24px] text-white font-bold'>Shareholders</h2>
            <button className='text-grayLight hover:text-white'>
              <QuestionIcon width={20} height={20} />
            </button>
          </div>

          <div className='flex flex-col gap-4 mb-6 px-4'>
            <div className='flex w-full rounded-lg h-10 overflow-hidden'>
              <span
                className='h-full bg-[linear-gradient(270deg,_#A06AFF_0%,_#482090_100%)]'
                style={{ width: `${getShareholderChartWidth('institutional')}%` }}
              />
              <span
                className='h-full bg-orange'
                style={{ width: `${getShareholderChartWidth('insiders')}%` }}
              />
              <span
                className='h-full bg-[linear-gradient(90deg,_#6AA5FF_0%,_#1F4792_100%)]'
                style={{ width: `${getShareholderChartWidth('retail')}%` }}
              />
            </div>

            <ul className='flex gap-4'>
              <li className='flex items-center gap-3'>
                <span
                  style={{ backgroundColor: '#A06AFF' }}
                  className='size-3 block rounded-[50%]'
                />
                <p className='text-[12px] uppercase text-grayLight font-bold'>Institutional</p>
              </li>

              <li className='flex items-center gap-3'>
                <span
                  style={{ backgroundColor: '#FFA800' }}
                  className='size-3 block rounded-[50%]'
                />
                <p className='text-[12px] uppercase text-grayLight font-bold'>Insiders</p>
              </li>

              <li className='flex items-center gap-3'>
                <span
                  style={{ backgroundColor: '#6AA5FF' }}
                  className='size-3 block rounded-[50%]'
                />
                <p className='text-[12px] uppercase text-grayLight font-bold'>Retail</p>
              </li>
            </ul>
          </div>
          {error ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white'>
              Error: {error?.message}
            </div>
          ) : tableData.length === 0 ? (
            <div className='h-[293px] w-full rounded-lg mt-6 opacity-40 text-white flex items-center justify-center'>
              No Data
            </div>
          ) : (
            <Table
              columns={columns}
              rows={tableData}
              rowKey={() => String(Math.random())}
              pagination={{ currentPage: 1, onChange: setPage, totalPages: 4 }}
              containerClassName='!rounded-[0px]'
            />
          )}
        </ContentWrapper>
      )}
    </>
  );
};
