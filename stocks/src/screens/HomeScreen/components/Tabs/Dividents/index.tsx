'use client';

import AttributeColumnCard from '@/components/UI/AttributeColumnCard';
import ProcedureForPaymentDividends from './ProcedureForPaymentDividends';
import DividendHistory from './DividendHistory';
import HistoryOfClosingDividendGap from './HistoryOfClosingDividendGap';
import DividendGraphicByYears from './DividendGraphicByYears';
import { dividendPaymentsDataMockData, dividendMetricsMockData } from './constants';
import { useQuery } from '@tanstack/react-query';
import { StocksService } from '@/services/StocksService';
import { useParams } from 'next/navigation';
/*
import DividendMetrics from './DividendMetrics';
import DividendPaymentDate from './DividendPaymentDate';
import TelegramSubscribe from './TelegramSubscribe';
*/

const Dividents = () => {
  const { stockName } = useParams<{ stockName: string }>();

  const { data } = useQuery({
    queryKey: ['dividents'],
    queryFn: () => StocksService.dividends('us', stockName),
  });

  return (
    <section className='flex flex-col gap-6'>
      <div className='grid grid-cols-[60%,auto] gap-6'>
        <DividendGraphicByYears />
        <div className='flex flex-col gap-6'>
          <AttributeColumnCard title='Dividend Yield' items={dividendPaymentsDataMockData} />
          <AttributeColumnCard title='Dividend Metrics' items={dividendMetricsMockData} />
        </div>
      </div>
      {/*<TelegramSubscribe /> */}

      <DividendHistory />

      <ProcedureForPaymentDividends />

      <HistoryOfClosingDividendGap />
    </section>
  );
};

export default Dividents;
