import { FC, ReactNode } from 'react';
import ReloadIcon from '@/assets/icons/actions/reload.svg';
import Button from '@/components/UI/Button/Button';
import HorizontalGradient from '@/components/UI/gradients/HorizontalGradient';
import { IHistoy, THistoyActions } from './type';
import Pagination from '@/components/UI/Pagination';
import HistoryEl from './HistoyEl';

const actions: Record<THistoyActions, ReactNode> = {
  reload: (
    <Button variant='gray'>
      <ReloadIcon width={22} height={22} />
    </Button>
  ),
};

const history: IHistoy[] = [
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Canceled',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expired',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Failed',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Canceled',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expired',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Failed',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Canceled',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expired',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Failed',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'Momentum Breakout: Signals with 65% accuracy',
    ends: '22 Dec 2025',
    status: 'Canceled',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '22 Dec 2025',
    status: 'Expired',
    actions: ['reload'],
  },
  {
    author: 'John Smith',
    type: 'Signal',
    name: 'ETH/USDT',
    ends: '21 Dec 2025',
    status: 'Failed',
    actions: ['reload'],
  },
];

const History: FC = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        {history.map((el, index) => (
          <HorizontalGradient key={index}>
            <HistoryEl history={el} actions={actions} />
          </HorizontalGradient>
        ))}
      </div>
      <div className='flex justify-center items-center mt-12 mb-[80px]'>
        <Pagination totalPages={4} currentPage={1} onChange={() => {}} />
      </div>
    </div>
  );
};

export default History;
