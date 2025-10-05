'use client';

import type { FC } from 'react';
import ContentWrapper from '@/components/UI/ContentWrapper';
import { formatMoney } from '@/helpers/formatMoney';
import { StockComparisonCard } from './StockComparisonCard';
import {
  marketMockData,
  peRatioMockData,
  dividendForecastMockData,
  epsMockData,
  stockComparsionFilterOptions,
  companyMetaMock,
} from '../constants';

const today = new Date().toLocaleDateString();

export const StockComparisonDiagram: FC = () => (
  <ContentWrapper className='py-6'>
    <div className='px-4 pb-4 border-b-[1px] border-regaliaPurple'>
      <div className='flex items-center gap-[200px] text-[15px] font-bold text-white'>
        <span>{today}</span>
        <div className='flex items-center gap-40'>
          <span>NVIDIA</span>
          <span>Apple</span>
        </div>
      </div>
    </div>
    <section className='flex flex-col gap-6 px-4 mt-6'>
      <StockComparisonCard
        data={marketMockData}
        title='Market value'
        options={stockComparsionFilterOptions}
        mapTotalValue={(value) => formatMoney(value, '$', 2)}
        className='border-b-[1px] border-regaliaPurple'
      />
      <StockComparisonCard
        data={marketMockData}
        title='Market Capitalization'
        options={stockComparsionFilterOptions}
        mapTotalValue={(value) => formatMoney(value, '$', 2)}
        className='border-b-[1px] border-regaliaPurple'
      />
      <StockComparisonCard
        data={peRatioMockData}
        title='P/E Ratio'
        options={stockComparsionFilterOptions}
        className='border-b-[1px] border-regaliaPurple'
        yAxisSymbol=''
      />
      <StockComparisonCard
        data={epsMockData}
        title='Deluted EPS'
        options={stockComparsionFilterOptions}
        className='border-b-[1px] border-regaliaPurple'
        yAxisSymbol=''
      />
      <StockComparisonCard
        data={dividendForecastMockData}
        title='Yield & Dividend Forecast'
        options={stockComparsionFilterOptions}
        yAxisSymbol=''
      />
    </section>
    <div className='flex items-center gap-x-20 text-[15px] font-bold text-white px-4 py-6'>
      <ul className='flex flex-col gap-y-12'>
        <li>
          <span>Sector</span>
        </li>
        <li>
          <span>Industry</span>
        </li>
        <li>
          <span>CEO</span>
        </li>
      </ul>
      {companyMetaMock.map(({ sector, industry, ceo }, i) => (
        <ul className='flex flex-col gap-y-12' key={i}>
          <li>
            <span>{sector}</span>
          </li>
          <li>
            <span>{industry}</span>
          </li>
          <li>
            <span>{ceo}</span>
          </li>
        </ul>
      ))}
    </div>
  </ContentWrapper>
);
