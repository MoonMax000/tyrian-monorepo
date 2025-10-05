'use client';
import { FC, useState } from 'react';
import CheckBox from '../UI/ChecBox';
import Image from 'next/image';
import Table from '../UI/Table';
import Paper from '../UI/Paper';
import TagLabel from '../UI/TagLabel';
import ProcentLabel from '../UI/ProcentLabel';
import Button from '../UI/Button/Button';
import PAGINATION from '@/screens/mock/Pagination (V1).svg';
import ModalWrapper from '../UI/ModalWrapper';
import LedtModal from '@/screens/mock/modal/left.svg';
import RightModal from '@/screens/mock/modal/right.svg';

const MOC_ACTIONS = [
  { tittle: '7d', type: 'select' },
  { tittle: 'Место трейдера', type: 'select' },
  { tittle: 'Тип трейдера', type: 'select' },
  { tittle: 'Страна', type: 'select' },
  { tittle: 'Значок трейдера', type: 'select' },
  { tittle: 'Торговые боты', type: 'checkbox' },
  { tittle: 'Доступные трейдеры', type: 'checkbox' },
];

interface ITag {
  tag: string;
  category: 'good' | 'midle';
}
function formatNumber(number: number): string {
  return number
    .toLocaleString('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/,/g, '.');
}
type TableActions = 'max' | 'copy' | 'lock';
interface User {
  img: string;
  tags: ITag[];
  id: number;
  name: string;
  roi: number;
  trades: number;
  subscrbes: number;
  successTrades: number;
  inndexStability: string;
  subscribe: number;
  action: TableActions;
}

const UserData: User[] = [
  {
    name: 'tradername',
    id: 1,
    img: '/avatars/1.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 2,
    img: '/avatars/2.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'lock',
  },
  {
    name: 'tradername',
    id: 4,
    img: '/avatars/4.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 3,
    img: '/avatars/3.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 4,
    img: '/avatars/4.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'max',
  },
  {
    name: 'tradername',
    id: 5,
    img: '/avatars/5.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 6,
    img: '/avatars/6.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 7,
    img: '/avatars/7.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 8,
    img: '/avatars/8.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 9,
    img: '/avatars/9.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 10,
    img: '/avatars/10.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 11,
    img: '/avatars/11.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 12,
    img: '/avatars/12.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 13,
    img: '/avatars/13.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'copy',
  },
  {
    name: 'tradername',
    id: 14,
    img: '/avatars/14.svg',
    tags: [
      { tag: 'Топ по прибыли', category: 'good' },
      { tag: 'Успешная серия', category: 'good' },
    ],
    roi: -1000,
    trades: -1000000000,
    subscrbes: -1000000000,
    successTrades: -1000,
    inndexStability: '5.0/5.0',
    subscribe: 1000,
    action: 'max',
  },
];

const AllTraders: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const renderButton = {
    copy: (
      <Button variant={'secondary'} className='w-40' onClick={() => setIsOpen(true)}>
        Копировать
      </Button>
    ),
    max: (
      <Button className='w-40'>
        <div className='flex items-center justify-center gap 1'>
          <Image src='/icons/fire.svg' alt='' width={15} height={13} />
          Maкс.
        </div>
      </Button>
    ),
    lock: (
      <Button variant={'danger'} className='w-40 flex justify-center items-center'>
        <Image src='/icons/lock.svg' alt='' width={18} height={18} />
      </Button>
    ),
  };
  const Headers = () => {
    return (
      <div className='grid grid-cols-[25%,8%,11%,11%,11%,10%,10%,14%] text-xs font-bold items-center px-4'>
        <div className=' text-left'>
          <p className='opacity-45'>Никнейм</p>
        </div>

        <div className='flex items-center gap-2 '>
          <p className='opacity-45'>7д ROI</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p className='opacity-45 w-[58px]'>7d P&L трейдеры</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p className='opacity-45  w-[77px]'>7d P&L подписчиков</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p className='opacity-45  w-[92px]'>7d % успешных сделок</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p className='opacity-45 w-[80px]'>Индекс стабильности</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className='flex items-center gap-2 '>
          <p className='opacity-45'>Подписано</p>
          <div className='flex flex-col gap-[2px]'>
            <Image src='/icons/rowTop.svg' width={8} height={3.78} alt='arrow' />
            <Image src='/icons/rowButton.svg' width={8} height={3.78} alt='arrow' />
          </div>
        </div>
        <div className=' text-right'>
          <p className='opacity-45'>Действие</p>
        </div>
      </div>
    );
  };

  const renderRow = (user: User) => (
    <div className='grid grid-cols-[25%,8%,11%,11%,11%,10%,10%,14%] items-center text-body-12 py-3 border-t border-[#FFFFFF14] px-4'>
      <div className='flex items-center gap-1'>
        <Image src={user.img} width={44} height={44} alt='avatar' className='rounded-full' />
        <div>
          <p className='text-[15px] font-semibold mb-1'>{user.name}</p>
          <div className='flex gap-[13px] flex-wrap'>
            {user.tags.map((el, index) => {
              return <TagLabel value={el.tag} category={el.category} key={index} />;
            })}
          </div>
        </div>
      </div>
      <div className='text-[13px] font-semibold'>{<ProcentLabel value={user.roi} />}</div>
      <div className='text-[13px] font-semibold'>{formatNumber(user.trades)}</div>
      <div className='text-[13px] font-semibold'>{formatNumber(user.subscrbes)}</div>
      <div className='text-[13px] font-semibold'>{<ProcentLabel value={user.successTrades} />}</div>
      <div className='text-[13px] font-semibold'>{user.inndexStability}</div>
      <div className='text-[13px] font-semibold'>{formatNumber(user.subscribe)}</div>
      <div>{renderButton[user.action]}</div>
    </div>
  );
  return (
    <section className='mt-[17px]'>
      <div className='flex gap-[19px]'>
        {MOC_ACTIONS.map((el) => {
          return (
            <div key={el.tittle}>
              {el.type === 'select' ? (
                <div key={el.tittle} className='flex items-center'>
                  <p className='text-[13px] font-semibold'>{el.tittle}</p>
                  <Image
                    src='/icons/arrow-white.svg'
                    width={24}
                    height={24}
                    alt='arrow'
                    className='transform rotate-90'
                  />
                </div>
              ) : (
                <div key={el.tittle} className='flex gap-2 items-center'>
                  <CheckBox />
                  <p className='text-[13px] font-semibold'>{el.tittle}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Paper className='p-0 px-0 mt-6'>
        <Table headers={<Headers />} data={UserData} renderRow={renderRow} />
      </Paper>
      <PAGINATION className='mx-auto mt-6' />
      {isOpen && (
        <ModalWrapper onClose={() => setIsOpen(false)}>
          <div className='flex'>
            <LedtModal />
            <RightModal />
          </div>
        </ModalWrapper>
      )}
    </section>
  );
};

export default AllTraders;
