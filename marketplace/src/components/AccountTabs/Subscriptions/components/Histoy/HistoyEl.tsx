import { FC, ReactNode } from 'react';
import { IHistoy, THistoyActions, TStatus } from './type';
import { TIndicator } from '@/components/UI/Indicator/types';
import Indicator from '@/components/UI/Indicator';

interface Props {
  history: IHistoy;
  actions: Record<THistoyActions, ReactNode>;
}
const indicatorColor: Record<TStatus, TIndicator> = {
  Expired: 'gray',
  Canceled: 'blue',
  Failed: 'red',
};

const HistoryEl: FC<Props> = ({ history, actions }) => {
  return (
    <div className='grid grid-cols-[50%,50%]'>
      <div className='grid grid-cols-[20%_70%] justify-start gap-6 items-center'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-xs font-bold text-webGray uppercase'>author</h3>
          <p className='text-body-15'>{history.author}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='text-xs font-bold text-webGray uppercase'>name</h3>
          <p className='text-body-15'>{history.name}</p>
        </div>
      </div>
      <div className='grid grid-cols-[13.5%_20%_42%_10%] justify-start gap-6 items-center'>
        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>type</h3>
          <p className='text-body-15'>{history.type}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>Ended On</h3>
          <p className='text-body-15'>{history.ends}</p>
        </div>

        <div className='flex flex-col gap-2'>
          <h3 className='font-bold text-xs uppercase text-webGray'>status</h3>
          <div className='flex gap-2 items-center'>
            {<Indicator color={indicatorColor[history.status]} />}{' '}
            <p className='text-body-15'>{history.status}</p>
          </div>
        </div>

        <div className='flex justify-end items-center'>
          {history.actions &&
            history.actions.map((action) => <div key={action}>{actions[action]}</div>)}
        </div>
      </div>
    </div>
  );
};

export default HistoryEl;
