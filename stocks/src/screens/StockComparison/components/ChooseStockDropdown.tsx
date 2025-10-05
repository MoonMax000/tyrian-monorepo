import ContentWrapper from '@/components/UI/ContentWrapper';
import SearchInput from '@/components/SearchInput';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useRef } from 'react';
import { StockModel } from './StocksSelectAndData';
import PercentBlock from './PercentBlock';
import { useClickOutside } from '@/hooks/useClickOutside';

const mockStocksList: StockModel[] = [
  { id: 1, name: 'NVIDIA Corporation', shortName: 'NVDA', price: 14866.1, percent: -2 },
  { id: 2, name: 'NVIDIA Corporation2', shortName: 'NVDA2', price: 14866.1, percent: -2 },
  { id: 3, name: 'Apple', shortName: 'AAPL', price: 27732.47, percent: -1.32 },
  { id: 4, name: 'Apple2', shortName: 'AAPL2', price: 27732.47, percent: 1.32 },
];

interface ChooseStockProps {
  className?: string;
  isOpen?: boolean;
  onChoose: (stock: StockModel) => void;
  onCloseDropdown: () => void;
}

const ChooseStockDropdown: FC<ChooseStockProps> = ({
  className,
  isOpen,
  onChoose,
  onCloseDropdown,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, onCloseDropdown);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx('absolute top-full left-0 pt-[46px] z-50', className)}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          ref={wrapperRef}
        >
          <ContentWrapper className='!p-0'>
            <SearchInput
              placeholder='Enter ticker or company name'
              inputWrapperClassName='bg-background'
              className='!bg-background'
            />

            <ul className='border-t border-onyxGrey'>
              {mockStocksList.map((stock) => (
                <li
                  key={stock.id}
                  role='button'
                  onClick={() => {
                    onChoose(stock);
                  }}
                  className='py-4 px-6 flex items-center justify-between hover:bg-moonlessNight'
                >
                  <div className='flex flex-col gap-2'>
                    <p className='text-body-15'>{stock.shortName}</p>
                    <p className='text-body-15 opacity-[48%]'>{stock.name}</p>
                  </div>
                  <div className='flex flex-col gap-2 items-end'>
                    <p className='text-base leading-[22px] font-semibold'>
                      {stock.price.toFixed(2)} ₽
                    </p>
                    <PercentBlock percent={stock.percent} />
                  </div>
                </li>
              ))}
            </ul>
          </ContentWrapper>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChooseStockDropdown;
