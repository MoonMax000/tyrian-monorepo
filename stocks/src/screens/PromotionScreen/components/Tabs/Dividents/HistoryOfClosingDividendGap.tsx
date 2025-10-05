import Paper from '@/components/Paper';
import Link from 'next/link';

const HistoryOfClosingDividendGap = () => {
  return (
    <Paper className='!px-0'>
      <div className='flex items-center justify-between px-6'>
        <h3 className='text-h4 '>История закрытия дивидендного гэпа</h3>
        <Link
          href='/calendar-2024'
          className='text-body-15 underline underline-offset-2 text-purple'
        >
          {'Дивидендный календарь 2024 >'}
        </Link>
      </div>
    </Paper>
  );
};

export default HistoryOfClosingDividendGap;
