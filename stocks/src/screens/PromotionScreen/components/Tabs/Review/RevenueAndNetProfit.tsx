import Paper from '@/components/Paper';
import { formatCurrency } from '@/helpers/formatCurrency';

interface RevenueAndNetProfitModel {
  year: number;
  revenue: number; // выручка
  netProfit: number; // чистая прибыль
}

const mockData: RevenueAndNetProfitModel[] = [
  { year: 2019, netProfit: 0, revenue: 5550000000 },
  { year: 2020, netProfit: 0, revenue: 10040000000 },
  { year: 2021, netProfit: 0, revenue: 12043000000 },
  { year: 2022, netProfit: 100075000, revenue: 15041000000 },
  { year: 2023, netProfit: 882050000, revenue: 19096000000 },
];

const determinateAmountValue = (amount: number): string => {
  if (amount > 1000000 && amount < 1000000000) {
    const value = (amount / 1000000).toFixed(2);
    return `${value} M`;
  }
  if (amount > 1000000000) {
    const value = (amount / 1000000000).toFixed(2);
    return `${value} B`;
  }
  return formatCurrency(amount, {
    minimumFractionDigits: 2,
  });
};

const RevenueAndNetProfit = () => {
  return (
    <Paper>
      <h3 className='text-h4'>Выручка и чистая прибыль</h3>

      <ul className='mt-6 flex flex-col gap-4'>
        {mockData.map((data) => (
          <li key={data.year} className='flex items-center gap-2'>
            <p className='text-body-12 font-bold opacity-[48%] min-w-max'>{data.year} г.</p>
            <div className='flex flex-col gap-1 w-full'>
              <div className='flex items-center gap-2 w-full'>
                <div
                  className='bg-[linear-gradient(90deg,rgba(96,64,153,0)_0%,#A06AFF_100%)] rounded-[4px] h-4'
                  style={{ width: `${50}%` }}
                />
                <p className='text-body-15 min-w-max'>{determinateAmountValue(data.revenue)}</p>
              </div>
              <div className='flex items-center gap-2 w-full'>
                <div
                  className='bg-[linear-gradient(90deg,rgba(6,136,53,0)_0%,#45FAB3_100%)] rounded-[4px] h-4'
                  style={{ width: `${30}%` }}
                />
                <p className='text-body-15 min-w-max'>{determinateAmountValue(data.netProfit)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className='flex items-center justify-center gap-5 mt-8'>
        <div className='flex items-center gap-2'>
          <span className='block size-4 rounded-[4px] bg-[#A06AFFCC]' />
          <span className='uppercase text-body-12 font-bold opacity-[48%]'>Revenue</span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='block size-4 rounded-[4px] bg-[#45FAB3CC]' />
          <span className='uppercase text-body-12 font-bold opacity-[48%]'>Прибыль</span>
        </div>
      </div>
    </Paper>
  );
};

export default RevenueAndNetProfit;
