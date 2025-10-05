'use client';
import { StocksBlock } from '@/components/StocksBlock/StocksBlock';
import Image from 'next/image';
import { StocksValues } from './mockData';
import { useQuery } from '@tanstack/react-query';
import { IMarketLeadersEl, MainPageService } from '@/services/MainPageService';
import { getImageLink } from '@/helpers/getImageLink';
import Skeleton from '@/components/UI/Skeleton';
import { useRouter } from 'next/navigation';

const transformMarketLeadersToStocksValues = (data: IMarketLeadersEl[]): StocksValues[] => {
  return data.map((item) => ({
    title: item.symbol,
    logo: getImageLink(item?.icon ?? ''),
    desc: item.name,
    price: item.price.toFixed(2),
    percent: +item.changesPercentage.toFixed(2),
  }));
};

export const Stocks = () => {
  const { data: marketLeadersGrowthData, isLoading: isGrowthLoading } = useQuery<StocksValues[]>({
    queryKey: ['getMarketLeadersGrowth'],
    queryFn: async () => {
      const response = await MainPageService.marketLeadersGrowth('us', 6);
      return transformMarketLeadersToStocksValues(response);
    },
  });

  const { data: marketLeadersVolumeData, isLoading: isVolumeLoading } = useQuery<StocksValues[]>({
    queryKey: ['getMarketLeadersVolume'],
    queryFn: async () => {
      const response = await MainPageService.marketLeadersVolume('us', 6);
      return transformMarketLeadersToStocksValues(response);
    },
  });

  const { data: marketLeadersLosersData, isLoading: isLosersLoading } = useQuery<StocksValues[]>({
    queryKey: ['getMarketLeadersLosers'],
    queryFn: async () => {
      const response = await MainPageService.marketLeadersLosers('us', 6);
      return transformMarketLeadersToStocksValues(response);
    },
  });

  const { push } = useRouter();

  const handleClickHighestVolume = () => {
    push('/crypto-currency/stocks?category=Highest-volume');
  };

  const handleClickGainers = () => {
    push('/crypto-currency/stocks?category=Gainers');
  };

  const handleClickLosers = () => {
    push('/crypto-currency/stocks?category=Losers');
  };

  return (
    <div className='flex w-full flex-col items-center gap-20 relative mt-20'>
      <Image
        className='absolute z-[-1] left-[-110px] top-[-298px] scale-[118%] '
        width={2038}
        height={1210}
        alt='image'
        src={'/Ribbon2.png'}
      />
      <h1 className='text-purple text-[39px] font-bold'>Stocks</h1>
      <div className='flex gap-5'>
        {isVolumeLoading ? (
          <Skeleton className='w-[487px] h-[490px]' />
        ) : (
          <StocksBlock
            isStocks
            onClick={handleClickHighestVolume}
            content={marketLeadersVolumeData ?? []}
            title='Highest Volume'
          />
        )}
        {isGrowthLoading ? (
          <Skeleton className='w-[487px] h-[490px]' />
        ) : (
          <StocksBlock
            isStocks
            onClick={handleClickGainers}
            content={marketLeadersGrowthData ?? []}
            title='Gainers'
          />
        )}
        {isLosersLoading ? (
          <Skeleton className='w-[487px] h-[490px]' />
        ) : (
          <StocksBlock
            isStocks
            onClick={handleClickLosers}
            content={marketLeadersLosersData ?? []}
            title='Losers'
          />
        )}
      </div>
    </div>
  );
};
