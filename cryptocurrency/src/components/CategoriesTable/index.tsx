import { useState } from 'react';
import clsx from 'clsx';

import Pagination from '@/components/UI/Pagination';
import Paper from '@/components/UI/Paper';
import ProcentLabel from '@/components/UI/ProcentLabel';

import IconInfoCirle from '@/assets/icons/info-circle.svg';
import GainersLosersBar from '../GainersLosersBar';
import { useGetCategoriesQuery } from '@/store/api/cryptoApi';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrencyShort } from '@/utils/helpers/formatCurrencyShort';

const ITEMS_PER_PAGE = 25;

const CategoriesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: categories, isFetching } = useGetCategoriesQuery({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const hasNextPage = categories && categories.length === ITEMS_PER_PAGE;
  const totalPages = hasNextPage ? currentPage + 1 : currentPage;

  const handlePageChange = (page: number) => {
    if (!isFetching && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <Paper className='!px-0 py-0 !pb-0 w-full'>
      <div className='grid items-center grid-cols-[4%,145px,1fr,2.3fr,1.2fr,1.1fr,1fr,1.5fr] p-4 bg-moonlessNight whitespace-nowrap'>
        <p className='opacity-40 text-titletable text-xs'>#</p>
        <p className='opacity-40 text-titletable text-xs uppercase'>Name</p>
        <p className='opacity-40 text-titletable  text-xs text-center uppercase'>Δ Avg</p>
        <p className='opacity-40 text-titletable  text-xs text-left uppercase'>Top Gainer</p>
        <div className='flex items-center justify-end gap-2 opacity-40'>
          <p className='text-titletable uppercase text-xs'>Market CAp</p>
          <IconInfoCirle />
        </div>
        <p className='opacity-40 text-titletable text-center uppercase text-xs'>Dominance</p>
        <div className='flex items-center justify-center gap-2 opacity-40'>
          <p className='text-titletable uppercase text-xs'>Volume</p>
          <IconInfoCirle />
        </div>
        <p className='opacity-40 text-titletable text-center uppercase text-xs'>
          GAINERS/LOSERS NUMBER
        </p>
      </div>

      <ul className={clsx('transition-all', { 'opacity-50': isFetching })}>
        {categories?.map((category, index) => (
          <Link href={`/categories/${category.id}`} key={category.id}>
            <li className='grid items-center grid-cols-[4%,145px,1fr,2.2fr,1.2fr,1.1fr,1fr,1.5fr] p-4 border-b border-moonlessNight hover:bg-[#272A32]'>
              <span className='text-xs'>{index + 1 + (currentPage - 1) * ITEMS_PER_PAGE}</span>
              <p className='text-xs leading-5'>{category.name}</p>

              <div className='flex items-center justify-center'>
                <ProcentLabel
                  value={Math.round(category.avgPriceChange * 100) / 100}
                  symbolAfter='%'
                  className='text-xs'
                />
              </div>

              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <Image src={category.logo} alt={category.slug} width={24} height={24} />
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-xs font-semibold'>{category.coin}</span>
                    <span className='text-xs font-bold opacity-40'>{category.slug}</span>
                  </div>
                </div>
                <ProcentLabel
                  value={Math.round(category.maxPercentChange24 * 100) / 100}
                  symbolAfter='%'
                  className='ml-2 text-xs'
                />
              </div>

              <div className='flex items-center justify-end whitespace-nowrap'>
                <span className='text-xs font-semibold'>
                  {formatCurrencyShort(category.marketCap)}
                </span>
              </div>

              <div className='flex items-center justify-center whitespace-nowrap'>
                <span className='text-xs'>{category.dominance.toFixed(2)}%</span>
              </div>

              <div className='flex flex-col items-center justify-end whitespace-nowrap'>
                <span className='text-xs leading-5'>{formatCurrencyShort(category.volume)}</span>
              </div>

              <div className='flex justify-center'>
                <GainersLosersBar gainersCount={9} losersCount={1} />
              </div>
            </li>
          </Link>
        ))}
      </ul>
      <div className='mt-8'>
        <Pagination
          leftArrowDisabled={currentPage === 1}
          rightArrowDisabled={currentPage === totalPages}
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />
      </div>
    </Paper>
  );
};

export default CategoriesTable;
