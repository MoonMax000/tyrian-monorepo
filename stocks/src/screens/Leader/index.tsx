'use client';

import Container from '@/components/UI/Container';
import { IMarketLeadersEl, MainPageService } from '@/services/MainPageService';
import { useMutation } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import Loaders from '@/components/UI/Skeleton';
import LeadersTable from '@/components/Tables/LeadersTable';

type PageType = 'volume' | 'growth' | 'volatile' | 'losers';

interface Props {
  type: PageType;
}

const PageData = {
  volume: 'Volume Leaders',
  growth: 'Top Gainers',
  losers: 'Top Losers',
  volatile: 'Most Volatile Stocks',
};

const Leader: FC<Props> = ({ type }) => {
  const [tableData, setTableData] = useState<IMarketLeadersEl[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mutationVolumeGrowth = useMutation({
    mutationFn: () => MainPageService.marketLeadersGrowth('us', 25),
    onSuccess: (data) => {
      setTableData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('Error loading data::', error);
      setIsLoading(false);
    },
  });

  const mutationVolume = useMutation({
    mutationFn: () => MainPageService.marketLeadersVolume('us', 25),
    onSuccess: (data) => {
      setTableData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('Error loading data::', error);
      setIsLoading(false);
    },
  });

  const mutationVolatile = useMutation({
    mutationFn: () => MainPageService.marketLeadersVolatile('us', 25),
    onSuccess: (data) => {
      setTableData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('Error loading data::', error);
      setIsLoading(false);
    },
  });

  const mutationLosers = useMutation({
    mutationFn: () => MainPageService.marketLeadersLosers('us', 25),
    onSuccess: (data) => {
      setTableData(data);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('Error loading data::', error);
      setIsLoading(false);
    },
  });

  useEffect(() => {
    setIsLoading(true);
    switch (type) {
      case 'volume':
        mutationVolume.mutate();
        break;
      case 'growth':
        mutationVolumeGrowth.mutate();
        break;
      case 'volatile':
        mutationVolatile.mutate();
        break;
      case 'losers':
        mutationLosers.mutate();
        break;
      default:
        setIsLoading(false);
    }
  }, [type]);

  return (
    <Container className='mb-[120px]'>
      <h3 className='text-h3  mb-8'>{PageData[type]}</h3>
      {isLoading ? <Loaders className='w-full h-[120px]' /> : <LeadersTable data={tableData} />}
    </Container>
  );
};

export default Leader;
