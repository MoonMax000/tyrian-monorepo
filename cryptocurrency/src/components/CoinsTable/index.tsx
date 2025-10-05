import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';

import { useGetListingLatestQuery } from '@/store/api/cryptoApi';

import SmallDiagram from '@/components/Diagrams/SmallShortDiagram';
import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';
import Pagination from '@/components//UI/Pagination';

import IconInfoCirle from '@/assets/icons/info-circle.svg';
import { formatCurrency } from '@/utils/helpers/formatCurrency';
import { formatCurrencyShort } from '@/utils/helpers/formatCurrencyShort';

const LIMIT = 25;

const AllCoinsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: allCoins, isFetching } = useGetListingLatestQuery({
    limit: LIMIT,
    page: currentPage,
  });

  const hasNextPage = allCoins && allCoins.length === LIMIT;
  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  const handlePageChange = (page: number) => {
    if (!isFetching && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  if (!allCoins) return <div>Loading...</div>;

  return (
    <Paper className='!px-0 py-0 !pb-0 w-full'>
      <div className='grid items-center grid-cols-[3.5%,12.5%,11%,6.5%,6.5%,6.5%,13%,13%,15%,auto] p-4 mt-3 bg-moonlessNight'>
        <p className='opacity-40 text-titletable text-left'>#</p>
        <p className='opacity-40 text-titletable text-left'>NAME</p>
        <p className='opacity-40 text-titletable text-left'>PRICE</p>
        <p className='opacity-40 text-titletable text-left'>% 1H</p>
        <p className='opacity-40 text-titletable text-left'>% 24H</p>
        <p className='opacity-40 text-titletable text-left'>% 7D</p>
        <div className='flex items-center justify-center gap-[6px]'>
          <p className='opacity-40 text-titletable text-right'>MARKET CAP</p>
          <IconInfoCirle className='size-4 opacity-[48%]' />
        </div>
        <div className='flex items-center justify-start gap-[6px]'>
          <p className='opacity-40 text-titletable text-right'>VOLUME (24H)</p>
          <IconInfoCirle className='size-4 opacity-[48%]' />
        </div>
        <div className='flex items-center justify-start gap-[6px]'>
          <p className='opacity-40 text-titletable text-right'>CIRCULATING SUPPLY</p>
          <IconInfoCirle className='size-4 opacity-[48%]' />
        </div>
        <p className='opacity-40 text-titletable text-right'>LAST 7 DAYS</p>
      </div>

      <ul className={clsx('transition-all', { 'opacity-50': isFetching })}>
        {allCoins.map((item, index) => (
          <Link href={`/coins/${item.slug}?symbol=${item.symbol}`} key={item.id}>
            <li className='grid items-center  grid-cols-[3.5%,12.5%,11%,6.5%,6.5%,6.5%,13%,13%,15%,auto] p-4 border-b-2 border-moonlessNight'>
              <span className='text-xs'>{index + 1 + (currentPage - 1) * LIMIT}</span>
              <div className='flex items-center'>
                <Image
                  width={32}
                  height={32}
                  src={item.logo}
                  alt={`${item.symbol} logo`}
                  className='mr-2'
                />
                <p className='text-xs leading-5 font-bold'>{item.name}</p>
              </div>
              <p className='text-xs leading-5 font-bold text-left'>
                {formatCurrency(item.quote.USD.price)}
              </p>
              <ProcentLabel
                value={Number(item.quote.USD.percent_change_1h)}
                symbolAfter='%'
                className='text-center text-xs !py-0 !w-fit'
              />

              <ProcentLabel
                value={Number(item.quote.USD.percent_change_24h)}
                symbolAfter='%'
                className='text-center text-xs !py-0 !w-fit'
              />

              <ProcentLabel
                value={Number(item.quote.USD.percent_change_7d)}
                symbolAfter='%'
                className='text-center text-xs !py-0 !w-fit'
              />
              <p className='text-xs leading-5 font-bold text-center'>
                {formatCurrencyShort(item.quote.USD.market_cap)}
              </p>

              <p className='flex justify-start text-xs gap-2 font-bold text-left'>
                {formatCurrencyShort(item.quote.USD.volume_24h)}
                <span className=' opacity-50 '>
                  {formatCurrencyShort(item.quote.USD.volume_24h / item.quote.USD.price, '')}{' '}
                  {item.symbol}
                </span>
              </p>

              <div className='flex flex-col gap-2'>
                <div className='flex text-xs items-center font-bold justify-between'>
                  <p>
                    {formatCurrencyShort(item.circulating_supply, '')} {item.symbol}
                  </p>
                  <div className='relative w-full max-w-12 mt-[-6px]'>
                    <div className='absolute w-[90%] h-1 bg-white  rounded-full right-2 '>
                      <div className='absolute  top-0 h-full w-4/5 bg-purple  rounded-full' />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-end'>
                <SmallDiagram className='max-w-[102px] w-full' />
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <Pagination
        leftArrowDisabled={currentPage === 1}
        rightArrowDisabled={currentPage === totalPages}
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={handlePageChange}
      />
    </Paper>
  );
};

export default AllCoinsTable;
