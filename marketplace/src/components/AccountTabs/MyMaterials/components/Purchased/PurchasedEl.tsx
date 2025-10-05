import { FC, ReactNode } from 'react';
import { IPurchased, TPurchasedActions } from './type';

interface Props {
  purchased: IPurchased;
  actions: Record<TPurchasedActions, ReactNode>;
}

const PurchasedEl: FC<Props> = ({ purchased, actions }) => {
  return (
    <div className='grid grid-cols-[70%,30%]'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-body-12 font-bold text-purple uppercase'>{purchased.type}</h3>
        <p className='text-body-15'>{purchased.name}</p>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-body-12 uppercase text-webGray'>Purchased</h3>
          <p>{purchased.purchased}</p>
        </div>

        <div className='flex gap-4'>
          {purchased.actions &&
            purchased.actions.map((action) => <div key={action}>{actions[action]}</div>)}
        </div>
      </div>
    </div>
  );
};

export default PurchasedEl;
