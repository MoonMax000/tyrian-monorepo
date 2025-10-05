import { FC } from 'react';
import Button from '../UI/Button/Button';
import GearIcon from '@/assets/icons/gear.svg';
import Calendar from './conponents/Calendar.svg';
import News from './conponents/News.svg';
import Portfolio from './conponents/Portfolio.svg';
import SectorMover from './conponents/SectorMover.svg';
import WatchList from './conponents/WatchList.svg';
import { cn } from '@/utilts/cn';
import Search from '../Header/components/Search';

interface Props {
  isCollapsed: boolean;
}

export const RightMenu: FC<Props> = ({ isCollapsed }) => {
  return (
    <section
      className={cn(
        'flex flex-col gap-6 min-h-ful border-l-[1px] border-regaliaPurple overflow-hidden',
        {
          'w-0 p-0': !isCollapsed,
          'min-w-[456px] p-6': isCollapsed,
        },
      )}
    >
      <div className='flex gap-4 '>
        <Search className='max-w-[348px] w-full' />
        <Button
          className='min-w-11 min-h-11 border border-regaliaPurple !p-0  flex items-center justify-center'
          variant='ghost'
          fullWidth={false}
          icon={<GearIcon width={24} height={24} className='text-lighterAluminum' />}
        />
      </div>

      <SectorMover />
      <Portfolio />
      <WatchList />
      <News />
      <Calendar />
    </section>
  );
};
