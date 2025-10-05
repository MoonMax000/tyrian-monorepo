'use client';
import Paper from '@/components/Paper';
import ShortReview from '@/components/ShortReview';
import Container from '@/components/UI/Container';

import { FC, ReactNode, useMemo, useState } from 'react';
import { DATA } from '../HomeScreen/components/Tabs/Review/StockPriceChart';
import { format, subMonths, subYears } from 'date-fns';
import clsx from 'clsx';
import SingleAreaDiagram from '@/components/Diagrams/SingleAreaDiagram';
import { tabs } from './constants';
import Tabs from '@/components/Tabs';
import Button from '@/components/UI/Button';
import PortfolioTable from './PortfolioTable';
import ModalWrapper from '@/components/UI/Modal';
import AddModal from './Modals/AddModal';

// Функция для формирования диапазонов
const calculateDateRanges = () => {
  const today = new Date();
  return [
    {
      label: '1М',
      key: 'month',
      startDate: format(subMonths(today, 1), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '6М',
      key: 'six_months',
      startDate: format(subMonths(today, 6), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '1Г',
      key: 'year',
      startDate: format(subYears(today, 1), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: '5Л',
      key: 'five_years',
      startDate: format(subYears(today, 5), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
    {
      label: 'Макс.',
      key: 'max',
      startDate: format(subYears(today, 50), 'yyyy-MM-dd'),
      endDate: format(today, 'yyyy-MM-dd'),
    },
  ];
};

// Используем динамически вычисляемые фильтры
export const yearFilters = calculateDateRanges();

const MyPortfolios: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [activeYearFilter, setActiveYearFilter] = useState<string>(yearFilters[0].key);
  const [isOpenModal, setOpenModal] = useState<boolean>(false);

  const tabComponents = useMemo((): Record<(typeof tabs)[number]['key'], ReactNode> => {
    return {
      general: <PortfolioTable />,
      portfolio_1: <PortfolioTable />,
      portfolio_2: <PortfolioTable />,
    };
  }, []);
  return (
    <Container>
      <h3 className='text-h3 pl-6 mb-12'>Мои портфели</h3>
      <section className='mb-20'>
        <div className='grid grid-cols-[35%_63%] gap-6'>
          <Paper className='p-6 max-w-[468px] font-semibold'>
            <ShortReview />
          </Paper>
          <Paper>
            <div className='flex items-center justify-between mb-5'>
              <h3 className='text-h4'>Динамика портфеля</h3>
              <div className='flex items-center gap-3'>
                {yearFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type='button'
                    className={clsx(
                      'rounded-[4px] text-body-15 transition-colors w-[55px] h-[26px]',
                      {
                        'bg-purple': activeYearFilter === filter.key,
                        'bg-[#FFFFFF0A]': activeYearFilter !== filter.key,
                      },
                    )}
                    // onClick={() => handleYearFilterClick(filter)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <SingleAreaDiagram id='short-review' data={DATA} className='max-h-[382px]' />
          </Paper>
        </div>
        <div className='mt-20 text'>
          <div className='flex gap-6 mb-6'>
            <Tabs
              tabClassName='text-[17px] opacity-[64%] data-[active=true]:opacity-100'
              activeTabKey={activeTab}
              tabs={tabs}
              onClick={(tab) => setActiveTab(tab.key)}
            />
            <Button
              className='max-w-[180px] w-full h-[40px] rounded-[8px] hover:opacity-50 cursor-pointer bg-purple'
              onClick={() => setOpenModal(true)}
            >
              Добавить портфель
            </Button>
          </div>
          {tabComponents[activeTab]}
        </div>
      </section>
      <ModalWrapper
        isOpen={isOpenModal}
        onClose={() => setOpenModal(false)}
        title='Добавить портфель'
        className='p-6 w-[470px]'
        titleClassName='text-white text-center'
      >
        {<AddModal />}
      </ModalWrapper>
    </Container>
  );
};

export default MyPortfolios;
