'use client';

import Paper from '@/components/Paper';

import DividendMetrics from './DividendMetrics';
import DividendPaymentDate from './DividendPaymentDate';
import TelegramSubscribe from './TelegramSubscribe';
import ProcedureForPaymentDividends from './ProcedureForPaymentDividends';
import DividendHistory from './DividendHistory';
import HistoryOfClosingDividendGap from './HistoryOfClosingDividendGap';

const Dividents = () => {
  return (
    <section className='flex flex-col gap-6'>
      <div className='grid grid-cols-[60%,auto] gap-6 mt-6'>
        <Paper>
          <h2 className='text-h4'>График дивидендов и доходности по годам</h2>
        </Paper>
        <div className='flex flex-col gap-6'>
          <DividendPaymentDate />
          <DividendMetrics />
        </div>
      </div>
      <TelegramSubscribe />

      <DividendHistory />

      <ProcedureForPaymentDividends />

      <HistoryOfClosingDividendGap />
    </section>
  );
};

export default Dividents;
