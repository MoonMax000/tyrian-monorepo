import { FC, ReactNode } from 'react';
import CrossIcon from '@/assets/icons/actions/tinCross.svg';
import PlusIcon from '@/assets/icons/actions/plus.svg';
import Button from '@/components/UI/Button/Button';
import HorizontalGradient from '@/components/UI/gradients/HorizontalGradient';
import { IActive, TActiveActions } from './type';
import ActiveEl from './ActiveEl';
import Pagination from '@/components/UI/Pagination';

const actions: Record<TActiveActions, ReactNode> = {
  add: (
    <Button variant='gray'>
      <PlusIcon width={20} height={20} />
    </Button>
  ),
  del: (
    <Button variant='danger'>
      <CrossIcon width={16} height={16} />
    </Button>
  ),
};

const active: IActive[] = [
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Active',
    price: '$15/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expiring',
    price: '$150/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Expiring',
    price: '$2/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Active',
    price: '$15/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expiring',
    price: '$150/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Expiring',
    price: '$2/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Active',
    price: '$15/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expiring',
    price: '$150/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Expiring',
    price: '$2/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Active',
    price: '$15/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expiring',
    price: '$150/month',
    actions: ['add', 'del'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Expiring',
    price: '$2/month',
    actions: ['add', 'del'],
  },
];

const Active: FC = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        {active.map((el, index) => (
          <HorizontalGradient key={index}>
            <ActiveEl activeEl={el} actions={actions} />
          </HorizontalGradient>
        ))}
      </div>
      <div className='flex justify-center items-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </div>
  );
};

export default Active;
