import Paper from '@/components/Paper';
import IconInfoCirle from '@/assets/icons/info-circle.svg';
import { Tooltip } from 'react-tooltip';
import { formatCurrency } from '@/helpers/formatCurrency';
import clsx from 'clsx';
import { PeperDetailsResponse, StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

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

const StatisticsBlock = () => {
  const pathname = usePathname();
  const path = pathname.split('/').pop();
  const stockSymbol = path || 'SBER';

  const [stockInfo, setStockInfo] = useState<Partial<PeperDetailsResponse>>({});

  const { data } = useQuery({
    queryKey: ['GetStockDetails', stockSymbol],
    queryFn: () => StocksService.peperDetails(stockSymbol).then((response) => response.data),
  });

  useEffect(() => {
    if (data) {
      const { value_today, high_price, low_price, board_id, isin } = data;
      setStockInfo({ value_today, high_price, low_price, board_id, isin });
    }
  }, [data]);

  const combinedData = [
    {
      label: 'Диапазон цен за сегодня',
      value:
        stockInfo.low_price && stockInfo.high_price
          ? { low: Number(stockInfo.low_price), high: Number(stockInfo.high_price) }
          : null,
    },
    {
      label: 'Объем торгов',
      value: stockInfo.value_today
        ? determinateAmountValue(Number(stockInfo.value_today))
        : 'Загрузка',
    },
    {
      label: 'Режим торгов',
      value: stockInfo.board_id || 'Загрузка',
    },
    {
      label: 'ISIN код',
      value: stockInfo.isin || 'Загрузка',
    },
  ];

  return (
    <section className='flex items-center gap-6'>
      {combinedData.map((statistic, index) => (
        <Paper key={statistic.label} className='flex flex-col gap-3 w-full h-[92px]'>
          <div className='flex items-center gap-[6px]'>
            <p className='text-body-12 font-bold opacity-40 uppercase'>{statistic.label}</p>
            <IconInfoCirle
              className='size-4 opacity-[48%]'
              data-tooltip-id={statistic.label}
              data-tooltip-content={`Tooltip for ${statistic.label}`}
            />
            <Tooltip id={statistic.label} />
          </div>
          {index === 0 && statistic.value && typeof statistic.value === 'object' ? (
            <div className='relative flex items-center'>
              <span className='text-h4'>{formatCurrency(statistic.value.low)}</span>

              <div className='flex-1 relative mx-2 h-[2px] bg-white/20'>
                <div
                  className='absolute top-[-7px] left-1/2 w-[16px] h-[16px] bg-purple rounded-full'
                  style={{
                    transform: 'translateX(-50%)',
                  }}
                ></div>
              </div>

              <span className='text-h4'>{formatCurrency(statistic.value.high)}</span>
            </div>
          ) : (
            <p
              className={clsx(
                'text-h4',
                typeof statistic.value === 'number'
                  ? {
                      'text-green': statistic.value > 0,
                      'text-red': statistic.value < 0,
                    }
                  : '',
              )}
            >
              {typeof statistic.value === 'string' || typeof statistic.value === 'number'
                ? statistic.value
                : 'Загрузка'}
            </p>
          )}
        </Paper>
      ))}
    </section>
  );
};

export default StatisticsBlock;
