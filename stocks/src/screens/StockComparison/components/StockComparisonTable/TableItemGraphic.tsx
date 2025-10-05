'use client';

import { AnimatePresence, motion } from 'framer-motion';
import AreaDiagramWithTwoAreas from '@/components/Diagrams/AreaDiagramWithTwoAreas';
import { FC, useState } from 'react';
import clsx from 'clsx';

const mockGraphicData = [
  {
    date: 'JAN ‘24 ',
    priceFirstStock: 4000,
    priceSecondStock: 3500,
    pv: 2400,
    amt: 2400,
  },
  {
    date: 'FEB ‘24 ',
    priceFirstStock: 3500,
    priceSecondStock: 3200,
    pv: 1398,
    amt: 2210,
  },
  {
    date: 'MAR ‘24 ',
    priceFirstStock: 2500,
    priceSecondStock: 2800,
    pv: 9800,
    amt: 2290,
  },
  {
    date: 'APR ‘24 ',
    priceFirstStock: 1800,
    priceSecondStock: 1500,
    pv: 3908,
    amt: 2000,
  },
  {
    date: 'MAY ‘24 ',
    priceFirstStock: 2200,
    priceSecondStock: 2800,
    pv: 4800,
    amt: 2181,
  },
  {
    date: 'JUN ‘24 ',
    priceFirstStock: 5400,
    priceSecondStock: 5000,
    pv: 3800,
    amt: 2500,
  },
  {
    date: 'JUL ‘24 ',
    priceFirstStock: 1000,
    priceSecondStock: 700,
    pv: 4300,
    amt: 2100,
  },

  {
    date: 'AUG ‘24 ',
    priceFirstStock: 6000,
    priceSecondStock: 3500,
    pv: 2400,
    amt: 2400,
  },
  {
    date: 'SEP ‘24 ',
    priceFirstStock: 5000,
    priceSecondStock: 3200,
    pv: 1398,
    amt: 2210,
  },
  {
    date: 'OCT ‘24 ',
    priceFirstStock: 6000,
    priceSecondStock: 5200,
    pv: 9800,
    amt: 2290,
  },
  {
    date: 'NOV ‘24 ',
    priceFirstStock: 3000,
    priceSecondStock: 2700,
    pv: 3908,
    amt: 2000,
  },
  {
    date: 'DEC ‘24 ',
    priceFirstStock: 1590,
    priceSecondStock: 2400,
    pv: 4800,
    amt: 2181,
  },
];

const TableItemGraphic: FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const [activeFilter, setActiveFilter] = useState<string>('m');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='px-6'
        >
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-[6px]'>
                <span className='size-2 min-w-2 min-h-2 rounded-[50%] bg-[#A06AFF]' />
                <p className='text-body-15'>NVIDIA</p>
              </div>
              <div className='flex items-center gap-[6px]'>
                <span className='size-2 min-w-2 min-h-2 rounded-[50%] bg-[#6AA5FF]' />
                <p className='text-body-15'>Apple</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                className={clsx(
                  'w-[55px] h-[26px] p-[10px] rounded-[4px] flex items-center justify-center transition-colors',
                  {
                    'bg-purple': activeFilter === 'm',
                    'bg-[#FFFFFF0A]': activeFilter !== 'm',
                  },
                )}
                onClick={() => setActiveFilter('m')}
              >
                M
              </button>
              <button
                type='button'
                className={clsx(
                  'w-[55px] h-[26px] p-[10px] rounded-[4px] flex items-center justify-center transition-colors',
                  {
                    'bg-purple': activeFilter === 'q',
                    'bg-[#FFFFFF0A]': activeFilter !== 'q',
                  },
                )}
                onClick={() => setActiveFilter('q')}
              >
                Q
              </button>
            </div>
          </div>
          <AreaDiagramWithTwoAreas
            data={mockGraphicData}
            className='!h-[320px]'
            id={`${(Date.now() + Math.random() * 20).toString()}`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TableItemGraphic;
