'use client';

import ContentWrapper from '@/components/UI/ContentWrapper';
import { useState } from 'react';
import clsx from 'clsx';
import ChooseStockDropdown from './ChooseStockDropdown';
import PercentBlock from './PercentBlock';
import AddIcon from '@/assets/icons/add-icon.svg';
/* import StockComparisonTable from './StockComparisonTable'; */

export interface StockModel {
  name: string;
  shortName: string;
  price: number;
  percent: number;
  id: number;
}

const StocksSelectAndData = () => {
  const [selectedStocks, setSelectedStocks] = useState<(StockModel | undefined)[]>([]);
  const [openDropdowns, setOpenDropdowns] = useState<{ first: boolean; second: boolean }>(
    {} as { first: boolean; second: boolean },
  );

  return (
    <>
      <div className='grid grid-cols-[280px,repeat(4,176px)] items-center gap-6 mb-6'>
        <ContentWrapper className='p-4'>
          {selectedStocks[0] && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <p className='text-body-15 line-clamp-1'>{selectedStocks[0].name}</p>
                <p className='text-body-12 font-semibold opacity-[48%]'>
                  {selectedStocks[0].shortName}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-base font-semibold'>$ {selectedStocks[0].price}</p>
                <PercentBlock percent={selectedStocks[0].percent} />
              </div>
            </div>
          )}
        </ContentWrapper>
        <ContentWrapper className='p-4'>
          {selectedStocks[1] && (
            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-2'>
                <p className='text-body-15 line-clamp-1'>{selectedStocks[1].name}</p>
                <p className='text-body-12 font-semibold opacity-[48%]'>
                  {selectedStocks[1].shortName}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-base font-semibold'>$ {selectedStocks[1].price}</p>
                <PercentBlock percent={selectedStocks[1].percent} />
              </div>
            </div>
          )}
        </ContentWrapper>
        <div className='relative'>
          <ContentWrapper
            role='button'
            onClick={() => setOpenDropdowns({ first: true, second: false })}
            className='!bg-transparent flex justify-center items-center transition-colors hover:!bg-purple text-regaliaPurple hover:text-white relative'
          >
            <div className='p-[10px] flex gap-1 items-center'>
              <AddIcon width={24} height={24} />
              <span className='text-body-15'>Add</span>
            </div>
          </ContentWrapper>
          <ChooseStockDropdown
            isOpen={openDropdowns.first}
            className='min-w-[465px]'
            onCloseDropdown={() => setOpenDropdowns((prev) => ({ ...prev, first: false }))}
            onChoose={(stock) => {
              setSelectedStocks(selectedStocks[1] ? [stock, selectedStocks[1]] : [stock]);
              setOpenDropdowns({ first: false, second: true });
            }}
          />
        </div>

        <div className='relative'>
          <ContentWrapper
            role='button'
            onClick={() => setOpenDropdowns({ first: false, second: true })}
            className={clsx(
              '!bg-transparent border-[1.5px] border-[#FFFFFF3D] flex justify-center items-center transition-colors text-regaliaPurple',
              {
                'hover:!bg-purple hover:text-white': selectedStocks.length !== 0,
                'opacity-[48%]': selectedStocks.length === 0,
              },
            )}
          >
            <div className='p-[10px] flex gap-1 items-center'>
              <AddIcon width={24} height={24} />
              <span className='text-body-15'>Add</span>
            </div>
          </ContentWrapper>

          <ChooseStockDropdown
            isOpen={openDropdowns.second}
            className='min-w-[465px] right-0 !left-auto'
            onCloseDropdown={() => setOpenDropdowns((prev) => ({ ...prev, second: false }))}
            onChoose={(stock) => {
              setSelectedStocks(
                selectedStocks[0] ? [selectedStocks[0], stock] : [undefined, stock],
              );
              setOpenDropdowns({ first: false, second: false });
            }}
          />
        </div>
      </div>

      {/*  <StockComparisonTable /> */}
    </>
  );
};

export default StocksSelectAndData;
