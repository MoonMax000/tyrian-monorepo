'use client';

import { FC } from 'react';

import AnalysitSmartCard from '@/components/CARDS/AnalystsCard/AnalystSmartCard';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';
import Question from '@/assets/icons/icon-question-wavy-border.svg';

import Breadcrumbs from '@/components/UI/Breadcrumbs';
import DescriptionCard from '@/components/UI/DescriptionCard';

import {
  AnalystCardInfo,
  PortfolioGain,
  AnalystTabs,
  BestTrade,
  PortfolioTable,
  AverageReturn,
} from './components';
import {
  mockAnalystCard,
  mockAnalystCardInfo,
  mockPortfolioGain,
  expertMock,
  mockReviews,
  mockBestTrades,
  mockPortfolioTable,
} from './constants';
import { AllocationChartBlock, mockPieData } from '@/components/AllocationChartBlock';
import { PerformanceChartBlock } from '@/components/PerformanceChartBlock';
import Paper from '@/components/UI/Paper';
import { ChartPie } from '@/components/UI/PieChart';
import Comments from '@/components/UI/Comment';

interface AnalystCardScreenProps {
  analystName: string;
}

export const AnalystCardScreen: FC<AnalystCardScreenProps> = ({}) => {
  return (
    <div className='w-full grow mb-[60px]'>
      <Breadcrumbs
        resolvedSegments={[
          {
            pathTo: 'analystys-tab',
            label: 'Investment consultants and Analysts and Traders',
          },
          {
            pattern: ({ isLast }) => isLast,
            map: (segment) =>
              segment
                .split('-')
                .map((s) => `${s[0].toUpperCase()}${s.slice(1)}`)
                .join(' '),
          },
        ]}
        withHomePage={false}
        className='mt-8'
      />
      <div className='flex gap-x-6 mt-6'>
        <div className='flex flex-col gap-y-4 min-w-[339px]'>
          <AnalysitSmartCard analyst={mockAnalystCard} />
          <div className='flex gap-6'>
            <Paper className='p-4 max-w-[157px]'>
              <div className='flex flex-col items-center gap-4'>
                <div className='flex items-center gap-x-2 text-lighterAluminum'>
                  <h3 className='text-[12px] uppercase font-bold'>Success Rate</h3>
                  <Question width={16} height={16} className='hover:text-white' />
                </div>
                <ChartPie
                  height={130}
                  width={130}
                  innerRadius={40}
                  outerRadius={60}
                  data={mockPieData}
                />
                <p className='w-[125px] text-center'>111 out of 128 profitable transactions</p>
              </div>
            </Paper>
            <AverageReturn />
          </div>

          <PortfolioGain portfolioGain={mockPortfolioGain} />
          <BestTrade bestTrade={mockBestTrades} />
          <ExpertCard expert={expertMock} />
          <Reviews reviews={mockReviews} avgAssessment={4.5} allReviewsCount={28} />
          <Disclaimer />
        </div>
        <div className='flex flex-col gap-y-4'>
          <AnalystCardInfo analystInfo={mockAnalystCardInfo} />
          <DescriptionCard title='Bio'>
            This algorithm is designed to optimize your trading decisions by analyzing market data
            in real time. It uses a combination of historical patterns and predictive models to
            identify high-probability entry and exit points. With a focus on risk management, the
            algorithm adjusts its strategy based on changing market conditions. Whether you’re
            trading manually or using automated systems, this tool provides clear, actionable
            signals. It supports multiple asset classes and can be integrated with most trading
            platforms. The algorithm continuously evolves through backtesting and real-time
            performance tracking. Installation is straightforward, with full documentation and user
            support included. Suitable for both beginner and experienced traders. Use it as a
            standalone system or combine it with your own strategy for enhanced results. Stay ahead
            of the market with data-driven insights and precision execution.The algorithm
            continuously evolves through backtesting and real-time performance tracking.
            Installation is straightforward, with full documentation and user support.
          </DescriptionCard>
          <AnalystTabs />
          <AllocationChartBlock title='Allocation' />
          <PerformanceChartBlock title='Portfolio Performance' />
          <PerformanceChartBlock title='Index Performance' />
          <PortfolioTable
            loading={false}
            error={null}
            data={mockPortfolioTable}
            portfolioName='Sarah Lee'
          />
          <Comments />
        </div>
      </div>
    </div>
  );
};
