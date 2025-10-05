'use client';

import RobotCardSmart from '@/components/CARDS/RobotCard/RobotCardSmart';
import ExpertCard from '@/components/CARDS/ExpertCard';
import Reviews from '@/components/Reviews';
import Disclaimer from '@/components/Disclaimer';
import BotSubscribersRaiting from '@/components/BotSubscribersRaiting';

import Paper from '@/components/UI/Paper';
import DescriptionCard from '@/components/UI/DescriptionCard';
import Breadcrumbs from '@/components/UI/Breadcrumbs';

import IconEth from '@/assets/icons/algorithm/icon-eth.svg';
import IconTether from '@/assets/icons/algorithm/icon-tether.svg';

import { mockReviews, robotMock, expertMock } from './constants';
import { AccuracyChartBlock } from '@/components/AccuracyChartBlock';
import { PerformanceChartBlock } from '@/components/PerformanceChartBlock';
import Comments from '@/components/UI/Comment';

function AlgorithmCardsScreen({ algorithmName }: { algorithmName: string }) {
  console.log('sdfsdf');
  return (
    <div className='mb-[60px]'>
      <Breadcrumbs
        className='mb-8'
        withHomePage={false}
        filterSegments={(segment) => segment !== 'algorithms'}
        resolvedSegments={[{ pathTo: 'robots-tab', label: 'Trading robots and Algorithms' }]}
      />
      <Paper className='p-4 flex items-center justify-between mb-6'>
        <span className='text-bold-24'>ETH/USDT</span>
        <div className='flex gap-2'>
          <IconEth />
          <IconTether />
        </div>
      </Paper>
      <div className='grid grid-cols-[1fr_auto] gap-6'>
        <div className='flex flex-col gap-6 min-w-[720px]'>
          <DescriptionCard title='Description'>
            <p className='text-[15px] font-medium'>
              This algorithm is designed to optimize your trading decisions by analyzing market data
              in real time. It uses a combination of historical patterns and predictive models to
              identify high-probability entry and exit points. With a focus on risk management, the
              algorithm adjusts its strategy based on changing market conditions. Whether you’re
              trading manually or using automated systems, this tool provides clear, actionable
              signals. It supports multiple asset classes and can be integrated with most trading
              platforms. The algorithm continuously evolves through backtesting and real-time
              performance tracking. Installation is straightforward, with full documentation and
              user support included. Suitable for both beginner and experienced traders. Use it as a
              standalone system or combine it with your own strategy for enhanced results. Stay
              ahead of the market with data-driven insights and precision execution.
            </p>
          </DescriptionCard>
          <DescriptionCard title='Overview'>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 uppercase'>Bybit</span>
                <span className='text-body-15 text-red'>shorts: 10x</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Profit</span>
                <span className='text-body-15'>15% per month</span>
              </div>
            </div>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Estimated APR</span>
                <span className='text-body-15 text-green'>+120.83%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Strategy</span>
                <span className='text-body-15'>Scalping</span>
              </div>
            </div>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>
                  ROI (Calc. APY for 30 days)
                </span>
                <span className='text-body-15 text-green'>+120.83%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Max Drawdown</span>
                <span className='text-body-15'>20%</span>
              </div>
            </div>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>
                  ROI (Calc. APY for 1 year)
                </span>
                <span className='text-body-15 text-green'>+520.00%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 uppercase'>Profit Sharing</span>
                <span className='text-body-15 text-green'>20%</span>
              </div>
            </div>
            <div className='grid grid-cols-2 p-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Estimated APR</span>
                <span className='text-body-15 text-green'>+120.83%</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray uppercase'>Uptime</span>
                <span className='text-body-15'>114 days, 7 hours, 13 minutes</span>
              </div>
            </div>
            <div className='grid grid-cols-2 px-4 pt-4'>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray'>AUM (USDT)</span>
                <span className='text-body-15'>216 632.59</span>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='text-body-12 text-webGray'>Subscribers</span>
                <span className='text-body-15'>4 071</span>
              </div>
            </div>
          </DescriptionCard>
          <PerformanceChartBlock title='Bot Performance' />
          <AccuracyChartBlock title='Accuracy' />
          <BotSubscribersRaiting />
          <Comments />
        </div>
        <div className='flex flex-col gap-y-4'>
          <RobotCardSmart robot={{ ...robotMock, robotName: algorithmName }} />
          <ExpertCard expert={expertMock} />
          <Reviews avgAssessment={4.5} reviews={mockReviews} allReviewsCount={28} />
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}

export default AlgorithmCardsScreen;
