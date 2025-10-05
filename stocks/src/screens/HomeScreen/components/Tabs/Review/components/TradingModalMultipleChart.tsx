import { useState, type FC } from 'react';
import Filter from '@/components/UI/Filter';
import TradingModalDiagram from '@/components/Diagrams/TradingModalDiagram';
import QuestionIcon from '@/assets/icons/question.svg';

const viewTypes = [
  { name: 'asset', key: 'asset' },
  { name: 'stock', key: 'stock' },
];

const years = [
  { name: '1D', key: 'one_day' },
  { name: '1M', key: 'one_month' },
  { name: '6M', key: 'six_months' },
  { name: '1Y', key: 'one_year' },
  { name: '5Y', key: 'five_years' },
  { name: 'ALL', key: 'all' },
];

const mockData = [
  {
    month: 'FEB',
    revenue: 120,
    ebitda: 30,
    netProfit: 60,
    fcf: 45,
    debtObligations: 20,
  },
  {
    month: 'MAR',
    revenue: 140,
    ebitda: 40,
    netProfit: 70,
    fcf: 55,
    debtObligations: 25,
  },
  {
    month: 'APR',
    revenue: 100,
    ebitda: 25,
    netProfit: 50,
    fcf: 35,
    debtObligations: 30,
  },
  {
    month: 'MAY',
    revenue: 160,
    ebitda: 50,
    netProfit: 80,
    fcf: 65,
    debtObligations: 22,
  },
  {
    month: 'JUN',
    revenue: 130,
    ebitda: 35,
    netProfit: 65,
    fcf: 50,
    debtObligations: 40,
  },
  {
    month: 'JUL',
    revenue: 170,
    ebitda: 55,
    netProfit: 90,
    fcf: 75,
    debtObligations: 30,
  },
  {
    month: 'AUG',
    revenue: 150,
    ebitda: 45,
    netProfit: 75,
    fcf: 60,
    debtObligations: 35,
  },
  {
    month: 'SEP',
    revenue: 200,
    ebitda: 70,
    netProfit: 110,
    fcf: 90,
    debtObligations: 28,
  },
  {
    month: 'OCT',
    revenue: 220,
    ebitda: 80,
    netProfit: 120,
    fcf: 100,
    debtObligations: 45,
  },
  {
    month: 'NOV',
    revenue: 180,
    ebitda: 60,
    netProfit: 95,
    fcf: 78,
    debtObligations: 38,
  },
  {
    month: 'DEC',
    revenue: 210,
    ebitda: 75,
    netProfit: 115,
    fcf: 95,
    debtObligations: 32,
  },
  {
    month: 'JAN',
    revenue: 250,
    ebitda: 90,
    netProfit: 130,
    fcf: 110,
    debtObligations: 50,
  },
];

const legend = [
  {
    label: 'Revenue',
    color: '#6AA5FF',
    fill: '#253044',
  },
  {
    label: 'Ebitda',
    color: '#FFB46A',
    fill: '#3D332C',
  },
  {
    label: 'Net profit',
    color: '#A06AFF',
    fill: '#2E2744',
  },
  {
    label: 'fcf',
    color: '#6AFF9C',
    fill: '#1C3430',
  },
  {
    label: 'debt obligations',
    color: '#FF6A79',
    fill: '#3D272E',
  },
];

export const TradingModalMultipleChart: FC = () => {
  const [activeYear, setActiveYear] = useState<string>(years[2].key);

  const [viewType, setViewType] = useState<string>(viewTypes[0].key);

  return (
    <div>
      <div className='flex justify-between flex-col sm:flex-row sm:items-center gap-2 mb-[18px]'>
        <div className='flex items-center gap-x-3'>
          <Filter
            className='!p-0 uppercase'
            options={viewTypes}
            active={viewType}
            onChange={setViewType}
          />
          <button className='text-grayLight hover:text-white'>
            <QuestionIcon width={16} height={16} />
          </button>
        </div>
        <Filter className='!p-0' options={years} active={activeYear} onChange={setActiveYear} />
      </div>
      <TradingModalDiagram data={mockData} height={273} />
      <div className='flex items-center justify-center gap-x-4 mt-[21px]'>
        {legend.map(({ label, color, fill }) => (
          <div
            key={label}
            className='px-2 py-3 rounded-[4px] flex items-center gap-x-2'
            style={{ backgroundColor: fill }}
          >
            <div className='size-2 rounded-full' style={{ backgroundColor: color }} />
            <span className='text-white uppercase font-bold text-[12px]'>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
