import Link from 'next/link';
import Table, { IColumn } from '@/components/UI/Table';
import ArrowRight from '@/assets/icons/chevron-right.svg';
import { formatNumberWithSymbols } from '@/helpers/formatNumberWithSymbols';

const mockData = [
  {
    last_date: '09.05.2024',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 25,
    gap: 0.18,
    close_gap: 0,
    drawdown: 0.0,
  },
  {
    last_date: '08.02.2024',
    closing_date: '12.02.2024',
    stock_price: 188.84,
    dividend_on_stocks: 25,
    gap: 0.18,
    close_gap: 0,
    drawdown: 0.0,
  },
  {
    last_date: '09.11.2023',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 22,
    gap: 0.18,
    close_gap: 0,
    drawdown: 0.0,
  },
  {
    last_date: '10.08.2023',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 22,
    gap: 0.18,
    close_gap: 2,
    drawdown: -0.1,
  },
  {
    last_date: '11.05.2023',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 22,
    gap: 0.18,
    close_gap: 5,
    drawdown: -0.97,
  },
  {
    last_date: '09.02.2023',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 21,
    drawdown: 0.0,
    gap: 0.18,
    close_gap: 1,
  },
  {
    last_date: '03.11.2022',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 19,
    drawdown: 0.0,
    gap: 0.18,
    close_gap: 0,
  },
  {
    last_date: '04.08.2022',
    closing_date: '13.05.2024',
    stock_price: 199.8,
    dividend_on_stocks: 19,
    drawdown: -0.57,
    gap: 0.18,
    close_gap: 4,
  },
];

const columns: IColumn<{
  last_date: string;
  closing_date: string;
  stock_price: number;
  dividend_on_stocks: number;
  gap: number;
  close_gap: number;
  drawdown: number;
}>[] = [
  {
    key: 'last_date',
    label: 'Last day to buy Shares (ex-date)',
    rowClassName: 'text-center text-grayLight',
    columnClassName: 'text-center',
  },
  {
    key: 'closing_date',
    label: 'Shareholder record Date',
    rowClassName: 'text-center text-grayLight',
    columnClassName: 'text-center',
  },
  {
    key: 'stock_price',
    label: 'Share price',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
    renderCell: ({ stock_price }) =>
      formatNumberWithSymbols({ num: stock_price, symbolBefore: '$', toFixed: 2 }),
  },
  {
    key: 'dividend_on_stocks',
    label: 'Dividend per share (DPS)',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
    renderCell: ({ dividend_on_stocks }) =>
      formatNumberWithSymbols({
        num: dividend_on_stocks,
        symbolBefore: '$',
        toFixed: dividend_on_stocks % 10 === 0 ? 0 : 2,
      }),
  },
  {
    key: 'gap',
    label: 'Gap',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
    renderCell: ({ gap }) => `${gap}%`,
  },
  {
    key: 'close_gap',
    label: 'Gap Closure',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
  },
  {
    key: 'drawdown',
    label: 'Drapdown',
    rowClassName: 'text-center',
    columnClassName: 'text-center',
    renderCell: ({ drawdown }) =>
      formatNumberWithSymbols({
        num: drawdown,
        symbolAfter: '%',
        toFixed: 2,
      }),
  },
];

const HistoryOfClosingDividendGap = () => {
  return (
    <Table
      columns={columns}
      rows={mockData}
      rowKey='closing_date'
      containerClassName='bg-background'
      tableClassName='!rounded-0'
      topContent={
        <div className='flex items-center gap-x-2 py-6 px-4'>
          <h2 className='text-white font-bold text-[24px]'>Dividend Gap Closure History</h2>
          <Link href='/dividends-schedule'>
            <ArrowRight width={16} height={16} />
          </Link>
          <ArrowRight width={16} height={16} className='-rotate-90 ml-auto' />
        </div>
      }
    />
  );
};

export default HistoryOfClosingDividendGap;
