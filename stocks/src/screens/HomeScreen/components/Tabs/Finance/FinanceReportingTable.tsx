import { ReactNode, useState } from 'react';
import { FIINANCE_REPORTING_TABLE_DATA, modalParams } from './constants';
import { numberFormater, transformObjectToArray } from './helper';
import clsx from 'clsx';
import SimpleBarDiagram from '@/components/Diagrams/SimpleBarDiagram';
import ExportIcon from '@/assets/export.svg';
import Modal from '@/components/UI/Modal';
import { ModalContent } from './ModalContent';

const tagList = [
  { name: 'Income Statement', key: 'profit_and_loss_report' },
  { name: 'Balance Sheet', key: 'balance-sheet' },
  { name: 'cash Flow Statement', key: 'cash-flow-statement' },
];

const filters = [
  { name: <> Q </>, key: 'q' },
  { name: <> Y </>, key: 'y' },
  { name: <>YoY Change (%)</>, key: 'change' },
];

const getCeil = (value: number): ReactNode => {
  if (value === 0) return <p className='flex items-center justify-start text-body-12'>-</p>;
  return <p className='flex items-center justify-start text-body-12'>{numberFormater(value)}</p>;
};

const FinanceReportingTable = () => {
  const [activeFilter, setActiveFilter] = useState<string>(filters[0].key);
  const [activeTagFilter, setActiveTagFilter] = useState<string>(tagList[0].key);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className='pt-6 px-4'>
        <h2 className='text-h4 mb-4'>Financial Statements</h2>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 flex-wrap '>
            {tagList.map((filter) => (
              <button
                key={filter.key}
                type='button'
                className={clsx(
                  ' uppercase px-[12px] h-[32px] rounded-[4px] transition-colors text-body-12 font-bold text-white items-center flex justify-center border border-regaliaPurple',
                  {
                    'bg-gradient-to-r from-[#A06AFF] to-[#482090]': activeTagFilter === filter.key,
                    'bg-onyxGrey opacity-48': activeTagFilter !== filter.key,
                  },
                )}
                onClick={() => setActiveTagFilter(filter.key)}
              >
                {filter.name}
              </button>
            ))}
          </div>
          <div className='flex items-center gap-3 '>
            {filters.map((filter) => (
              <button
                key={filter.key}
                type='button'
                className={clsx(
                  'uppercase min-w-[42px] px-3 h-[32px] rounded-[4px] transition-colors text-body-12 font-bold text-white items-center flex justify-center  bg-[#FFFFFF0A] border border-regaliaPurple',
                  {
                    'bg-gradient-to-r from-[#A06AFF] to-[#482090]': activeFilter === filter.key,
                    'bg-onyxGrey opacity-48': activeFilter !== filter.key,
                  },
                )}
                onClick={() => setActiveFilter(filter.key)}
              >
                {filter.name}
              </button>
            ))}
            <button
              type='button'
              onClick={() => setIsModalOpen(true)}
              className={clsx(
                'uppercase min-w-[42px] px-3 h-[32px] rounded-[4px] transition-colors text-body-12 font-bold text-white items-center flex justify-center  bg-onyxGrey border border-regaliaPurple opacity-48',
              )}
            >
              EXPORT <ExportIcon className='ml-1' />
            </button>
          </div>
        </div>
      </div>
      <div className='grid items-center justify-start grid-cols-[30%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%] px-4 pb-3 pt-3 mt-3 bg-onyxGrey opacity-48'>
        <p className='text-body-12 font-bold uppercase'>Metric</p>
        <p className='text-body-12 font-bold uppercase'>2014 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2015 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2016 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2017 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2018 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2019 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2020 г.</p>
        <p className='text-body-12 font-bold uppercase'>2021 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2022 Y.</p>
        <p className='text-body-12 font-bold uppercase'>2023 Y.</p>
        <p className='text-body-12 font-bold uppercase text-right'>Ltm</p>
      </div>

      <ul>
        {FIINANCE_REPORTING_TABLE_DATA &&
          FIINANCE_REPORTING_TABLE_DATA.map((item, index) => {
            const BarChartData = transformObjectToArray(item);

            return (
              <li
                key={`${item.name}-${index}`}
                className='grid  grid-cols-[30%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%,6.36%]  py-4 px-4 border-b-2 border-onyxGrey last:border-none'
              >
                <div className='flex justify-between items-center gap-2 pr-[32px]'>
                  <p className='text-left text-body-15'>{item.name}</p>
                  <SimpleBarDiagram data={BarChartData} width={68} height={26} />
                </div>
                {BarChartData.map((el, index) => (
                  <div
                    className='flex items-center justify-start odd:opacity-48 last:justify-end'
                    key={el.name + index}
                  >
                    {getCeil(el.pv)}
                  </div>
                ))}
              </li>
            );
          })}
      </ul>
      <Modal
        isOpen={!!isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className='!max-w-[512px] border border-regaliaPurple rounded-3xl'
        contentClassName='!overflow-hidden !max-w-[512px] h-fit !p-6 bg-[#0C101480] backdrop-blur-[100px] rounded-3xl'
      >
        <ModalContent />
      </Modal>
    </>
  );
};

export default FinanceReportingTable;
