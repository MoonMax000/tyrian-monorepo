'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import IconCoin from '@/assets/shares/mock.png';
import ModalWrapper from '@/components/UI/Modal';
import MockModal from './mockModal.svg';
import { useState } from 'react';
import Table, { type IColumn } from '@/components/UI/Table';
import PriceIndicator from '@/components/UI/PriceIndicator';
import { formatMoney } from '@/helpers/formatMoney';

const mockData = Array(15).fill({
  company_name: 'LENZOLOTO',
  shortName: 'LNZL',
  price: 10000000,
  buy_before: 9000000,
  dividends: 2380000,
  payment_date: '00.00.0000',
  income: 15.22,
  status: 'APPROVED',
  yieldProfit: 20,
});

const columns: IColumn<{
  company_name: string;
  shortName: string;
  price: number;
  buy_before: number;
  dividends: number;
  payment_date: string;
  income: number;
  status: string;
  yieldProfit: number;
}>[] = [
  {
    key: 'company_name',
    label: 'Company',
    rowClassName: 'text-left',
    columnClassName: 'text-left',
    renderCell: ({ company_name, shortName }) => (
      <div className='flex items-center gap-x-2'>
        <Image src={IconCoin} width={32} height={32} alt={company_name} />
        <div className='flex flex-col gap-y-2 text-[12px]'>
          <span className='text-white font-extrabold'>{shortName}</span>
          <span className='text-grayLight font-bold uppercase'>{company_name}</span>
        </div>
      </div>
    ),
  },
  {
    key: 'price',
    label: 'Price',
    renderCell: ({ price }) => formatMoney(price, '$', 2),
  },
  {
    key: 'buy_before',
    label: 'Buy before',
    renderCell: ({ buy_before }) => formatMoney(buy_before, '$', 2),
  },
  {
    key: 'dividends',
    label: 'Dividends',
    renderCell: ({ dividends }) => formatMoney(dividends, '$', 2),
  },
  {
    key: 'payment_date',
    label: 'Payment date',
  },
  {
    key: 'income',
    label: 'Income',
    renderCell: ({ income }) => <PriceIndicator percentChange={income} />,
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'yieldProfit',
    label: 'Yield',
    renderCell: ({ yieldProfit }) => `${yieldProfit}%`,
  },
];

const CalendarTable = () => {
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const [page, setPage] = useState(1);

  const columns = useMemo<
    IColumn<{
      company_name: string;
      shortName: string;
      price: number;
      buy_before: number;
      dividends: number;
      payment_date: string;
      income: number;
      status: string;
      yieldProfit: number;
    }>[]
  >(
    () => [
      {
        key: 'company_name',
        label: 'Company',
        rowClassName: 'text-left',
        columnClassName: 'text-left',
        renderCell: ({ company_name, shortName }) => (
          <div className='flex items-center gap-x-2'>
            <Image src={IconCoin} width={32} height={32} alt={company_name} />
            <div className='flex flex-col gap-y-2 text-[12px]'>
              <span
                className='text-white font-extrabold hover:underline'
                onClick={() => setOpenModal(true)}
              >
                {shortName}
              </span>
              <span className='text-grayLight font-bold uppercase'>{company_name}</span>
            </div>
          </div>
        ),
      },
      {
        key: 'price',
        label: 'Price',
        renderCell: ({ price }) => formatMoney(price, '$', 2),
      },
      {
        key: 'buy_before',
        label: 'Buy before',
        renderCell: ({ buy_before }) => formatMoney(buy_before, '$', 2),
      },
      {
        key: 'dividends',
        label: 'Dividends',
        renderCell: ({ dividends }) => formatMoney(dividends, '$', 2),
      },
      {
        key: 'payment_date',
        label: 'Payment date',
      },
      {
        key: 'income',
        label: 'Income',
        renderCell: ({ income }) => <PriceIndicator percentChange={income} />,
      },
      {
        key: 'status',
        label: 'Status',
      },
      {
        key: 'yieldProfit',
        label: 'Yield',
        renderCell: ({ yieldProfit }) => `${yieldProfit}%`,
      },
    ],
    [setOpenModal],
  );

  return (
    <>
      <Table
        columns={columns}
        rows={mockData}
        rowKey={() => Date.now().toString() + Math.random()}
        pagination={{
          currentPage: page,
          totalPages: 4,
          onChange: setPage,
        }}
        containerClassName='backdrop-blur-xl'
      />
      {isOpenModal && (
        <ModalWrapper
          isOpen={true}
          contentClassName='!w-[815px] !h-[591px] !p-0 !overflow-hidden '
          className='!w-[815px] !h-[591px] !p-0'
          onClose={() => setOpenModal(false)}
          closeIconClassname='!-right-[30px]'
        >
          <MockModal />
        </ModalWrapper>
      )}
    </>
  );
};

export default CalendarTable;
