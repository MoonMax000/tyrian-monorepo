import { FC, ReactNode } from 'react';
import { IActive, TActiveActions, TStatus } from './type';
import { TIndicator } from '@/components/UI/Indicator/types';
import Indicator from '@/components/UI/Indicator';

interface Props {
  activeEl: IActive;
  actions: Record<TActiveActions, ReactNode>;
}
const indicatorColor: Record<TStatus, TIndicator> = { Active: 'green', Expiring: 'orange' };

const ActiveEl: FC<Props> = ({ activeEl, actions }) => {
  return (
    <div className='grid grid-cols-[90%,10%]'>
      <div className='grid grid-cols-[8.67%_36.52%_7.5%_10.62%_10.62%_11.27%] justify-start gap-6 items-center'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xs font-bold text-webGray uppercase'>author</h3>
          <p className='text-body-15'>{activeEl.author}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-xs font-bold text-webGray uppercase'>name</h3>
          <p className='text-body-15'>{activeEl.name}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>type</h3>
          <p className='text-body-15'>{activeEl.type}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>ends</h3>
          <p className='text-body-15'>{activeEl.ends}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>status</h3>
          <div className='flex gap-2 items-center'>
            {<Indicator color={indicatorColor[activeEl.status]} />}{' '}
            <p className='text-body-15'>{activeEl.status}</p>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>price</h3>
          <p className='text-body-15'>{activeEl.price}</p>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-4'>
          {activeEl.actions &&
            activeEl.actions.map((action) => <div key={action}>{actions[action]}</div>)}
        </div>
      </div>
    </div>
  );
};

export default ActiveEl;
