import { FC, ReactNode } from 'react';
import TrashIcon from '@/assets/icons/actions/trash.svg';
import StarIcon from '@/assets/icons/actions/star.svg';
import Button from '@/components/UI/Button/Button';
import HorizontalGradient from '@/components/UI/gradients/HorizontalGradient';
import MaterialAddEl from './PurchasedEl';
import { IPurchased, TPurchasedActions } from './type';

const actions: Record<TPurchasedActions, ReactNode> = {
  favorite: (
    <Button variant='gray'>
      <StarIcon width={20} height={20} />
    </Button>
  ),
  del: (
    <Button variant='danger'>
      <TrashIcon width={20} height={20} />
    </Button>
  ),
};

const purchased: IPurchased[] = [
  {
    type: 'Algorithm',
    name: 'ETH/USDT',
    purchased: '14 May 2025',
    actions: ['favorite', 'del'],
  },
];

const Purchased: FC = () => {
  return (
    <div>
      <div className='flex flex-col gap-4'>
        {purchased.map((el, index) => (
          <HorizontalGradient key={index}>
            <MaterialAddEl purchased={el} actions={actions} />
          </HorizontalGradient>
        ))}
      </div>
    </div>
  );
};

export default Purchased;
