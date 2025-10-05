'use client';
import { FC, useState } from 'react';
import IconTag from '@/assets/icons/tag.svg';
import IconDiagram from '@/assets/icons/diagram.svg';
import ListBold from '@/assets/icons/list-controlers/list-bold.svg';

import BarDiagramWidthLines from '@/components/Diagrams/BarDiagramWidthLines';
import { FINANCE_INDICATORS_MOCK } from '@/components/Diagrams/constants';
import clsx from 'clsx';

const filters = [
  { name: <>Q</>, key: 'q' },
  { name: <>Y</>, key: 'y' },
  { name: <IconTag />, key: 'tag' },
  { name: <IconDiagram />, key: 'diagram' },
];

const templatesFilters = [
  { name: <>Revenue&Profit</>, key: 'revenue_&_profit' },
  { name: <>Assets</>, key: 'assets' },
  { name: <>Debt Load</>, key: 'debt_load' },
  { name: <>Cash Flows</>, key: 'cash_flows' },
  { name: <>Capital Expenditures</>, key: 'capital_costs' },
];

const chartList = [
  { name: 'Income Statement' },
  { name: 'Balance Sheet' },
  { name: 'Cash Flow Statement' },
];

const FinancicalIndicatorChart: FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>(filters[1].key);
  const [activeTemplateFilter, setActiveTemplateFilter] = useState<string>(templatesFilters[1].key);

  return (
    <div className='flex justify-between'>
      <div className='max-w-[830px] h-[579px] w-full px-4 py-6'>
        <div className='flex justify-between'>
          <h2 className='text-h4 mb-6'>Financial Metrics</h2>
          <div className='mt-2 mb-6 flex justify-between items-center'>
            <div className='flex items-center gap-3 '>
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type='button'
                  className={clsx(
                    'uppercase w-[42px] h-[32px] rounded-[4px] transition-colors text-body-12 font-bold text-white items-center flex justify-center ',
                    {
                      'bg-purple': activeFilter === filter.key,
                      'bg-onyxGrey opacity-48': activeFilter !== filter.key,
                    },
                  )}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        <BarDiagramWidthLines
          data={FINANCE_INDICATORS_MOCK}
          height={475}
          className='bg-transparent'
        />
      </div>
      <div className='bg-[#FFFFFF05] w-full max-w-[372px] h-[579px] border-l-[1px] border-regaliaPurple'>
        <div className='p-6 px-4'>
          <h2 className='text-h4 mb-4'>Templates</h2>
          <div className='flex items-center gap-1 flex-wrap '>
            {templatesFilters.map((filter) => (
              <button
                key={filter.key}
                type='button'
                className={clsx(
                  'uppercase px-[12px] h-[32px] rounded-[4px] transition-colors text-body-12 font-bold text-white items-center flex justify-center border-[1px] border-regaliaPurple',
                  {
                    'bg-gradient-to-r from-[#A06AFF] to-[#482090]':
                      activeTemplateFilter === filter.key,
                    'bg-onyxGrey': activeTemplateFilter !== filter.key,
                  },
                )}
                onClick={() => setActiveTemplateFilter(filter.key)}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
        <div className='h-[1px] bg-onyxGrey' />
        <div className='p-6 px-4'>
          <h2 className='text-2xl mb-4'>Custom Chart</h2>
          <div className='flex flex-col gap-4 pl-[8.47px]'>
            {chartList.map((el, index) => {
              return (
                <div key={index} className='flex items-center gap-[8.47px]'>
                  <ListBold />
                  <p className='text-body-15'>{el.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancicalIndicatorChart;
