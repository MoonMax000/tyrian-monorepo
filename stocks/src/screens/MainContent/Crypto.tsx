import React, { useEffect, useState } from 'react';
import { FundsGroup } from './FundsGroup';
import { BoundsGroup } from './BoundsGroup';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { CryptoFilter, CryptoResponse, StocksService } from '@/services/StocksService';
import { StocksValues } from './mockData';

export interface CryptoTab {
  id: number;
  name: string;
  isActive: boolean;
}

const tabsArray: CryptoTab[] = [
  { id: 0, name: 'Top Performing', isActive: true },
  { id: 1, name: 'Market Cap Ranking', isActive: false },
  { id: 2, name: 'TVL Ranking', isActive: false },
  { id: 3, name: 'Gainers', isActive: false },
  { id: 4, name: 'Losers', isActive: false },
];

enum FilterId {
  GAINERS = 3,
  LOSERS = 4,
}

export const Crypto = () => {
  const [tabs, setTabs] = useState(tabsArray);
  const [cardsContent, setCardsContent] = useState<StocksValues[] | undefined>([]);
  const [filter, setFilter] = useState<CryptoFilter>('gainers');

  const { push: pushTo } = useRouter();

  const { data: cryptoData, isSuccess } = useQuery({
    queryKey: ['crypto'],
    queryFn: () => StocksService.crypto({}),
  });

  const { data: gainersLosersData } = useQuery({
    queryKey: ['gainers_losers', filter],
    queryFn: () => StocksService.gainers_losers(filter),
  });

  const { data: tvlRankingData } = useQuery({
    queryKey: ['tvl-ranking'],
    queryFn: () => StocksService.tvlRanking(),
  });

  const correctGainersLosersData = gainersLosersData?.data.data.slice(0, 9);

  const handleChangeTab = (id: number) => {
    switch (id) {
      case FilterId.GAINERS:
        setFilter('gainers');
        setCardsContent(transformCryptoDataToStocksValues(correctGainersLosersData));
        break;
      case FilterId.LOSERS:
        setFilter('losers');
        setCardsContent(transformCryptoDataToStocksValues(correctGainersLosersData));
        break;

      default:
        setCardsContent(transformCryptoDataToStocksValues(cryptoData?.data.data));
    }

    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, isActive: !tab.isActive } : { ...tab, isActive: false },
      ),
    );
  };

  const transformCryptoDataToStocksValues = (
    data?: CryptoResponse[],
  ): StocksValues[] | undefined => {
    return data?.map((item) => ({
      title: item.symbol,
      logo: item?.logo ?? '',
      desc: item.name,
      price: item.quote.USD.price?.toFixed(2) ?? '0',
      percent: +item.quote.USD.percent_change_7d.toFixed(2),
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      setCardsContent(transformCryptoDataToStocksValues(cryptoData?.data.data));
    }
  }, [isSuccess]);

  return (
    <div className='flex w-full flex-col items-center gap-20 mt-20'>
      <h1 className='text-purple text-[39px] font-bold'>Crypto</h1>
      <div className='flex gap-5'>
        <BoundsGroup
          onClick={() => pushTo('/crypto-currency/crypto')}
          values={transformCryptoDataToStocksValues(cryptoData?.data?.data)}
          title='Most Trated'
        />
        <FundsGroup
          handleChangeTab={handleChangeTab}
          link='/crypto-currency/crypto'
          linkTitle='View All'
          values={cardsContent}
          tabs={tabs}
        />
      </div>
    </div>
  );
};
