'use client';

import CountriesSelect from '@/components/CountriesSelect';
import StockIndices from './components/StockIndices';
import StocksTable from './components/StocksTable';
import SwitchButtons from '@/components/UI/SwitchButtons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useLayoutEffect } from 'react';
import { filterValues } from './constants';
import { useQuery } from '@tanstack/react-query';
import { MarketLeader, StocksService } from '@/services/StocksService';
import { PopularListItem } from '@/components/UI/PopularList';
import DefaultIcon from '@/assets/defaultIcon.png';
import { getImageLink } from '@/helpers/getImageLink';

const StockScreen = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get('category') || 'All_coins';

  const handleChangeCategory = useCallback(
    (newTab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', newTab);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, searchParams],
  );

  useLayoutEffect(() => {
    if (!searchParams.has('category')) {
      const params = new URLSearchParams();
      params.set('category', 'All_coins');
      replace(`stocks?${params}`);
    }
  }, []);

  const { data: popularData, isLoading: isPopularLoading } = useQuery({
    queryKey: ['marketPopular'],
    queryFn: () =>
      StocksService.getMarketLeadersGrowthFull({
        country: 'us',
        sector: 'Basic Materials',
        limit: 5,
      }),
  });

  const mapToPopularListItems = (leaders: MarketLeader[] | []): PopularListItem[] =>
    leaders.map((leader) => ({
      img:
        leader.icon && leader.icon.includes('company_icons')
          ? getImageLink(leader.icon)
          : DefaultIcon.src,
      name: leader.companyName,
      price: leader.price,
      profit: leader.change_percent_7d,
      shortName: leader.symbol,
    }));

  return (
    <section className='stocks mt-6'>
      <div className='mb-12'>
        <CountriesSelect />
      </div>
      <StockIndices
        data={mapToPopularListItems(popularData?.data ?? [])}
        isLoading={isPopularLoading}
      />

      <div className='mt-6'>
        <SwitchButtons
          items={filterValues}
          currentValue={currentFilter}
          onChange={handleChangeCategory}
        />
      </div>

      <StocksTable currentFilter={currentFilter} country={'us'} />
    </section>
  );
};

export default StockScreen;
