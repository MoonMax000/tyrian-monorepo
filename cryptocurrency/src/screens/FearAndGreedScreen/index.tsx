'use client';

import HorizontalGreedometer from '@/components/HorizontalGreedometer';
import Container from '@/components/UI/Container';
import Paper from '@/components/UI/Paper';
import ButtonGroup from '@/components/UI/ButtonGroup';
import Button from '@/components/UI/Button';

import IconHint from '@/assets/icons/icon-hint.svg';
import FearGreedChart, { IFearGreedPoint } from '@/components/Diagrams/FearGreedChart';
import { TimeRange } from '@/components/Diagrams/types';
import { useMemo, useState } from 'react';
import { useGetCoinInfoQuery, useGetFearAndGreedQuery } from '@/store/api/cryptoApi';

const buttons: { label: string; value: TimeRange }[] = [
  { label: '1М', value: '1M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

const FearAndGreed = () => {
  const [activeButton, setActiveButton] = useState<TimeRange>(buttons[0].value);

  const limit = activeButton === '1M' ? 30 : 365;
  const { data: fearGreedData, isLoading: isFGLoading } = useGetFearAndGreedQuery({ limit });
  const { data: coinInfoData, isLoading: isCoinLoading } = useGetCoinInfoQuery({
    count: limit,
    interval: '1d',
    id: '1',
  });

  const reversedCoinInfo = useMemo(
    () => coinInfoData?.quotes?.slice().reverse() || [],
    [coinInfoData],
  );

  const transformedData = useMemo(() => {
    if (!fearGreedData) return [];

    return fearGreedData
      .reduce<IFearGreedPoint[]>((acc, item, index) => {
        if (!item.timestamp) return acc;

        const dateObj = new Date(Number(item.timestamp) * 1000);
        acc.push({
          date: dateObj.toISOString(),
          time: dateObj.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          fearGreedIndex: item.value,
          btcPrice: reversedCoinInfo[index]?.quote?.['2806']?.price ?? null,
          btcVolume: reversedCoinInfo[index]?.quote?.['2806']?.volume_24h ?? null,
        });
        return acc;
      }, [])
      .reverse();
  }, [fearGreedData, reversedCoinInfo]);

  const lastFearGreedIndex =
    transformedData.length > 0 ? transformedData[transformedData.length - 1].fearGreedIndex : 50;

  return (
    <Container>
      <div className='flex justify-between mt-12'>
        <div className='flex flex-col gap-4 max-w-[540px]'>
          <h1 className='text-[40px] font-bold'>Fear and Greed Index</h1>
          <p className='text-[15px] font-bold text-webGray'>
            Follow the latest crypto market news in real time: Bitcoin dominance level, altseason,
            net flows into ETFs and overall market sentiment. All this can be found on our portal.
          </p>
        </div>
        <Paper className='w-[417px] flex flex-col gap-4 h-fit'>
          <div className='flex items-center gap-1'>
            <h5 className='font-bold text-[15px]'>Fear and Greed Index</h5>
            <IconHint />
          </div>
          <HorizontalGreedometer value={lastFearGreedIndex} />
        </Paper>
      </div>
      <div className='pt-12 pb-[120px]'>
        <div className='flex justify-between'>
          <Paper className='h-[416px] w-full flex flex-col'>
            <div className='flex justify-between items-center'>
              <h3 className='font-bold text-2xl'>Fear and Greed Index Chart</h3>
              <div className='flex gap-6'>
                <ButtonGroup>
                  {buttons.map((button) => (
                    <Button
                      key={button.value}
                      variant={activeButton === button.value ? 'primary' : 'shadow'}
                      size='sm'
                      onClick={() => setActiveButton(button.value)}
                      className='text-xs'
                    >
                      {button.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </div>
            <div className='flex gap-4 py-4'>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-cornflowerBlue' />
                <p className='text-xs font-bold text-webGray uppercase'>Fear and Greed Index</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-webGray' />
                <p className='text-xs font-bold text-webGray uppercase'>Bitcoin price</p>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='size-[6px] rounded-full bg-[#4F5156]' />
                <p className='text-xs font-bold text-webGray uppercase'>bitcoin volume</p>
              </div>
            </div>

            <div className='flex-1 overflow-hidden'>
              {isCoinLoading && isFGLoading ? (
                ''
              ) : (
                <FearGreedChart
                  data={transformedData}
                  lastPoint={lastFearGreedIndex}
                  selectedTimeRange={activeButton}
                />
              )}
            </div>
          </Paper>
        </div>
      </div>
    </Container>
  );
};

export default FearAndGreed;
