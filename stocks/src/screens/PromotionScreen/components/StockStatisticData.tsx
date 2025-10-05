import Paper from '@/components/Paper';
import IconChevronRight from '@/assets/icons/chevron-right.svg';
import IconRussia from '@/assets/icons/countries/russia.svg';

import moex from '@/assets/shares/moex.png';
import sber from '@/assets/shares/sber.png';
import Image from 'next/image';
import { PeperDetailsResponse, StocksService } from '@/services/StocksService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import PercentLabel from '@/components/UI/percentLabel';
import { usePathname } from 'next/navigation';

const StockPriceChart = () => {
  const pathname = usePathname();
  const path = pathname.split('/').pop();
  const stockSymbol = path || 'SBER';

  const [stockInfo, setStockInfo] = useState<Partial<PeperDetailsResponse>>({});
  const [imageSrc, setImageSrc] = useState<string>(sber.src);

  const { data } = useQuery({
    queryKey: ['GetStockDetails', stockSymbol],
    queryFn: () => StocksService.peperDetails(stockSymbol).then((response) => response.data),
  });

  useEffect(() => {
    if (data) {
      const { capitalization, last_price, last_change, last_change_percents, ticker, short_name } =
        data;
      setStockInfo({
        capitalization,
        last_price,
        last_change,
        last_change_percents,
        ticker,
        short_name,
      });
    }
  }, [data]);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const dynamicImage = await import(`@/assets/shares/${stockSymbol.toUpperCase()}.png`);
        setImageSrc(dynamicImage.default || dynamicImage);
      } catch (error) {
        console.log(`Image for ${stockSymbol} not found, using default image.`);
        setImageSrc(sber.src);
      }
    };

    loadImage();
  }, [stockSymbol]);

  return (
    <Paper className='flex flex-col gap-[90px] p-6'>
      <div className='flex justify-between items-start'>
        <div>
          <div className='flex items-center gap-3'>
            <div className='flex items-center'>
              <Image src={moex.src} width={64} height={64} alt='moex' />
              <Image src={imageSrc} width={64} height={64} alt={stockSymbol} className='-ml-4' />
            </div>
            <div>
              <p className='text-h4'>{stockInfo.short_name || 'N/A'}</p>
              <div className='flex items-center'>
                <p className='text-body-15 text-purple'>MOEX</p>
                <IconChevronRight className='fill-purple mx-2 size-2' />
                <p className='text-body-15 opacity-[48%]'>{stockInfo.ticker || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-[22px]'>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-h4'>{stockInfo.last_price || 0} ₽</p>
              <PercentLabel value={Number(stockInfo.last_change) || 0} noBackground></PercentLabel>
              <PercentLabel
                value={Number(stockInfo.last_change_percents) || 0}
                symbolAfter='%'
              ></PercentLabel>
            </div>
            <p className='text-body-12 opacity-40 font-bold uppercase mt-[5px]'>
              Цена за акцию на сегодня
            </p>
          </div>
          <div>
            <p className='text-h4 uppercase'>{stockInfo.capitalization || 0} ₽</p>
            <p className='text-body-12 opacity-40 font-bold uppercase'>
              Рыночная стоимость выпуска акций{' '}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-[6px] px-2 py-[2px] rounded-[4px] bg-blackedGray'>
          <IconRussia className='size-6' />
          <p className='text-body-15'>Россия</p>
        </div>
      </div>
      <div>
        <p className='uppercase font-bold text-body-12'>
          <span className='opacity-40'>Сектор: </span>
          <span className='underline underline-offset-2'> В разработке</span>
        </p>
        <p className='uppercase font-bold text-body-12'>
          <span className='opacity-40'>Отрасль: </span>
          <span className='underline underline-offset-2'> В разработке</span>
        </p>
      </div>
    </Paper>
  );
};

export default StockPriceChart;
