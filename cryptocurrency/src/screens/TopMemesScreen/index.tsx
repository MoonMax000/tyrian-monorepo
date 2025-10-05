'use client';

import { Suspense, useState } from 'react';
import Container from '@/components/UI/Container';
import MemesCoinsTable from './components/MemesTable';
import { Tab } from '@/components/UI/TabsNavigation/interfaces';
import TabsNavigation from '@/components/UI/TabsNavigation';
import Paper from '@/components/UI/Paper';
import Pagination from '@/components/UI/Pagination';
import LeadersChart from './components/LeadersChart';
import ButtonGroup from '@/components/UI/ButtonGroup';
import Button from '@/components/UI/Button';
import ProcentLabel from '@/components/UI/ProcentLabel';
import MostVisitedTable from './components/MostVisitedTable';

import TopMemesIndex from '@/assets/indexes/memes-leaders.svg';

import IconEye from '@/assets/icons/icon-eye.svg';
import IconTime from '@/assets/icons/icon-time.svg';

const MOST_VISITED_BUTTONS = [
  { label: <IconEye />, value: 'all' },
  { label: <IconTime />, value: 'timed' },
];

const LEADERS_BUTTONS = [
  { label: '1Д', value: '1d' },
  { label: '1М', value: '1m' },
  { label: 'ВСЕ', value: 'all' },
];

const CAPITALIZATION_BUTTONS = [
  { label: '1Д', value: '1d' },
  { label: '1М', value: '1m' },
  { label: 'ВСЕ', value: 'all' },
];

const TopMemesScreen = () => {
  const [page, setPage] = useState<number>(1);
  const [mostVisitedActiveButton, setMostVisitedActiveButton] = useState<string>(
    MOST_VISITED_BUTTONS[0].value,
  );
  const [leadersActiveButton, setLeadersActiveButton] = useState<string>(LEADERS_BUTTONS[0].value);
  const [capitalizationActiveButton, setCapitalizationActiveButton] = useState<string>(
    CAPITALIZATION_BUTTONS[0].value,
  );

  const chartData = [
    {
      timestamp: '12:00',
      line1: 120,
      line2: 100,
      line3: 80,
    },
    {
      timestamp: 'ЯНВ 14',
      line1: 140,
      line2: 110,
      line3: 85,
    },
    {
      timestamp: '12:00',
      line1: 160,
      line2: 120,
      line3: 90,
    },
    {
      timestamp: 'ЯНВ 15',
      line1: 180,
      line2: 115,
      line3: 95,
    },
  ];

  const memeCoinsData = [
    {
      name: 'PUMPTRUMP',
      price: 0.02745,
      change_24h: -73.58,
    },
    {
      name: 'PHNIX',
      price: 0.004243,
      change_24h: -0.91,
    },
    {
      name: 'TRUMP',
      price: 4190.13,
      change_24h: 12.24,
    },
    {
      name: 'MONKY',
      price: 0.0008437,
      change_24h: -1.31,
    },
    {
      name: 'ELON',
      price: 0.00003147,
      change_24h: 15.51,
    },
  ];

  const tabs: Tab[] = [{ label: 'Memes', tab: 'memes', content: <MemesCoinsTable /> }];

  return (
    <Container>
      <div className='flex flex-col items-baseline gap-2 max-w-[720px]'>
        <h1 className='text-[32px] font-bold leading-[43px] max-w'>
          Топ токенов Memes по рыночной капитализации
        </h1>
        <p className='text-[16px] text-[#a7a8a9] font-semibold'>
          На этой странице перечислены ведущие монеты и токены мемов. Эти проекты представлены в
          листинге в порядке убывания, начиная с крупнейшего токена по рыночной капитализации.
        </p>
      </div>

      <div className='flex justify-between gap-6 pt-12'>
        <Paper className='flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Самые посещаемые</h2>
            <ButtonGroup>
              {MOST_VISITED_BUTTONS.map((button) => (
                <Button
                  key={button.value}
                  variant={mostVisitedActiveButton === button.value ? 'primary' : 'shadow'}
                  size='sm'
                  icon={button.label}
                  onClick={() => setMostVisitedActiveButton(button.value)}
                />
              ))}
            </ButtonGroup>
          </div>
          <MostVisitedTable data={memeCoinsData} />
        </Paper>
        <Paper className='flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Лидеры роста</h2>
            <ButtonGroup>
              {LEADERS_BUTTONS.map((button) => (
                <Button
                  key={button.value}
                  variant={leadersActiveButton === button.value ? 'primary' : 'shadow'}
                  size='sm'
                  icon={button.label}
                  onClick={() => setLeadersActiveButton(button.value)}
                />
              ))}
            </ButtonGroup>
          </div>
          <div className='flex items-start gap-8'>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-[#6AA5FF]' />
                <p className='text-[15px] font-semibold uppercase'>FOFAR</p>
              </div>
              <ProcentLabel value={208.64} symbolAfter='%' />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-[#A06AFF]' />
                <p className='text-[15px] font-semibold uppercase'>BABYNEIRO</p>
              </div>
              <ProcentLabel value={93.67} symbolAfter='%' />
            </div>
            <div className='flex flex-col items-start gap-2'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-[#6AFF9C]' />
                <p className='text-[15px] font-semibold uppercase'>NPCS</p>
              </div>
              <ProcentLabel value={90.16} symbolAfter='%' />
            </div>
          </div>
          <LeadersChart width={370} height={264} data={chartData} />
        </Paper>
        <Paper className='flex flex-col gap-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold'>Рын. кап.</h2>
            <ButtonGroup>
              {CAPITALIZATION_BUTTONS.map((button) => (
                <Button
                  key={button.value}
                  variant={capitalizationActiveButton === button.value ? 'primary' : 'shadow'}
                  size='sm'
                  icon={button.label}
                  onClick={() => setCapitalizationActiveButton(button.value)}
                />
              ))}
            </ButtonGroup>
          </div>
          <div className='flex justify-between items-center'>
            <div className='flex items-start flex-col gap-3'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-[#6AFF9C]' />
                <p className='text-[15px] font-semibold'>Рын. капитализация</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-[15px] font-bold'>10.72Т ₽</p>
                <ProcentLabel value={1.11} symbolAfter='%' />
              </div>
            </div>
            <div className='flex items-start flex-col gap-3'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-[#A06AFF]' />
                <p className='text-[15px] font-semibold'>Объем торгов</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-[15px] font-bold'>2.65Т ₽</p>
                <ProcentLabel value={-43.01} symbolAfter='%' />
              </div>
            </div>
          </div>
          <TopMemesIndex />
        </Paper>
      </div>

      <Paper className='p-0 mt-10 mb-40 px-0 pt-0'>
        <Suspense fallback={<div>Loading...</div>}>
          <TabsNavigation tabs={tabs} />
        </Suspense>
        <div className='mt-8'>
          <Pagination currentPage={page} totalPages={4} onChange={setPage} />
        </div>
      </Paper>
    </Container>
  );
};

export default TopMemesScreen;
