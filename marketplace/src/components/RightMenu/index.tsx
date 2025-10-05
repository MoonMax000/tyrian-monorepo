import { cn } from '@/utils/cn';
import { FC } from 'react';
import SearchInput from '../SearchInput';
import Button from '../UI/Button/Button';
import GearIcon from '@/assets/icons/gear.svg';
import Calendar from './conponents/Calendar.svg';
import News from './conponents/News.svg';
import Portfolio from './conponents/Portfolio.svg';
import SectorMover from './conponents/SectorMover.svg';
import WatchList from './conponents/WatchList.svg';

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
        <SearchInput className='max-w-[348px] w-full ' />
        <Button ghost className='w-11 h-11'>
          <GearIcon width={24} height={24} className='text-lighterAluminum' />
        </Button>
      </div>

      <SectorMover />
      <Portfolio />
      <WatchList />
      <News />
      <Calendar />
    </section>
  );
};
