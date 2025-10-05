import clsx from 'clsx';
import { FC } from 'react';

interface DiagramNotificationElProps {
  message: string;
  label: string;
  signal: 'good' | 'bad';
  classname: string;
}

const DiagramNotificationEl: FC<DiagramNotificationElProps> = ({
  message,
  label,
  signal,
  classname,
}) => (
  <div className={clsx('flex items-stretch gap-x-2 mt-4', classname)}>
    <span
      className={clsx('block w-1 rounded-[4px]', {
        'bg-green': signal === 'good',
        'bg-red': signal === 'bad',
      })}
    />
    <div className='flex flex-col gap-y-2'>
      <p className='text-[15px] text-white font-bold'>
        XXXX has demostrated stable long-term profit growth over the past 10 years (N%).
      </p>
      <span className='text-[12px] text-grayLight uppercase font-bold'>Growing ratio</span>
    </div>
  </div>
);

export default DiagramNotificationEl;
