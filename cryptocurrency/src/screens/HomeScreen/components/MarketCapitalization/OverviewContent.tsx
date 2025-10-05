import IconHint from '@/assets/icons/icon-hint.svg';
import AreaBarChart from '@/components/Diagrams/AreaBarChart';
import { ICurrencyDataQuote } from '@/components/Diagrams/MainAreaBarChart';
import { TimeRange, timeRangeParams } from '@/components/Diagrams/types';
import { useGetTotalCapQuery } from '@/store/api/cryptoApi';
import { formatShortCurrency } from '@/utils/helpers/formatShortCurrency';
import { calculateChange, getLastTwoValues } from '@/utils/helpers/marketData';
import { FC, useMemo } from 'react';

const OverviewContent: FC<{ timeRange: TimeRange }> = ({ timeRange }) => {
  const { count, interval } = timeRangeParams[timeRange];
  const { data: totalCap, isLoading } = useGetTotalCapQuery({ count, interval });

  const transformedData: ICurrencyDataQuote[] = useMemo(() => {
    if (!totalCap?.quotes) return [];

    return totalCap.quotes.reduce<ICurrencyDataQuote[]>((acc, entry) => {
      const usdData = entry.quote?.[2781];
      if (entry.timestamp && usdData?.total_market_cap) {
        acc.push({
          date: entry.timestamp,
          time: new Date(entry.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          total_market_cap: usdData.total_market_cap,
          total_volume_24h: usdData.total_volume_24h,
        });
      }
      return acc;
    }, []);
  }, [totalCap?.quotes]);

  const { last: lastMarketCap, prev: prevMarketCap } = getLastTwoValues(
    transformedData,
    'total_market_cap',
  );
  const { last: lastMarketVolume, prev: prevMarketVolume } = getLastTwoValues(
    transformedData,
    'total_volume_24h',
  );

  const marketCapChange = calculateChange(lastMarketCap, prevMarketCap);
  const marketVolumeChange = calculateChange(lastMarketVolume, prevMarketVolume);

  return (
    <div className='flex flex-col h-full'>
      <div className='flex gap-6'>
        <div className='flex flex-col gap-2'>
          <p className='text-[12px] text-[#87888b] font-semibold uppercase'>MARKET CAP</p>
          <div className='flex items-center gap-3'>
            <h6 className='text-sh1 font-bold'>{formatShortCurrency(lastMarketCap)}</h6>
            <div
              className={`font-bold text-body-12 p-1 rounded bg-opacity-10 flex justify-center items-center 
              ${marketCapChange && parseFloat(marketCapChange) >= 0
                  ? 'text-[#2ebd85] bg-[#2ebd85]'
                  : 'text-[#ef454a] bg-[#ef454a]'
                }`}
            >
              {marketCapChange
                ? `${parseFloat(marketCapChange) > 0 ? '+' : ''}${marketCapChange}%`
                : '—'}
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-1'>
            <p className='text-[12px] text-[#87888b] font-semibold uppercase'>24H TRADING VOLUME</p>
            <IconHint />
          </div>
          <div className='flex items-center gap-3'>
            <h6 className='text-sh1 font-bold'>{formatShortCurrency(lastMarketVolume)}</h6>
            <div
              className={`font-bold text-body-12 p-1 rounded bg-opacity-10 flex justify-center items-center 
              ${marketVolumeChange && parseFloat(marketVolumeChange) >= 0
                  ? 'text-[#2ebd85] bg-[#2ebd85]'
                  : 'text-[#ef454a] bg-[#ef454a]'
                }`}
            >
              {marketVolumeChange
                ? `${parseFloat(marketVolumeChange) > 0 ? '+' : ''}${marketVolumeChange}%`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      <div className='flex-grow'>
        {isLoading ? '' : <AreaBarChart data={transformedData} selectedTimeRange={timeRange} />}
      </div>
    </div>
  );
};

export default OverviewContent;
