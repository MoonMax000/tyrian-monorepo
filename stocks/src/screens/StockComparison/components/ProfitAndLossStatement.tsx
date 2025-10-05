import Table, { type IColumn } from '@/components/UI/Table';
import { formatDateMonthYear } from '@/helpers/formatDayMonthYear';
import { formatMoney } from '@/helpers/formatMoney';

const mockData = [
  {
    heading: 'Revenue',
    nvidia: 12200,
    apple: 42300,
  },
  {
    heading: 'Operating Expenses',
    nvidia: 1600,
    apple: 6200,
  },
  {
    heading: 'Operating Profit',
    nvidia: 7600,
    apple: 13300,
  },
  {
    heading: 'Revenue YoY Growth',
    nvidia: 93.61,
    apple: 10.67,
  },
  {
    heading: 'Gross Profit',
    nvidia: 9300,
    apple: 19500,
  },
];

const columns: IColumn<{
  heading: string;
  nvidia: number;
  apple: number;
}>[] = [
  {
    key: 'heading',
    label: formatDateMonthYear(new Date()),
    rowClassName: 'text-left text-[15px]',
    columnClassName: 'text-left',
  },
  {
    key: 'nvidia',
    label: 'Nvidia',
    renderCell: ({ nvidia }) => formatMoney(nvidia, '$', 2),
    rowClassName: 'text-[15px]',
  },
  {
    key: 'apple',
    label: 'Apple',
    renderCell: ({ apple }) => formatMoney(apple, '$', 2),
    rowClassName: 'text-[15px]',
  },
];

const ProfitAndLossStatement = () => {
  return (
    <Table
      columns={columns}
      rows={mockData}
      rowKey='heading'
      containerClassName='!rounded-[0px] border-none'
    />
  );
};

export default ProfitAndLossStatement;
