import { FC, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/UI/Button/Button';
import clsx from 'clsx';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import StarIcon from '@/assets/icons/star-icon.svg';
import { useRouter } from 'next/navigation';
import TickIcon from '@/assets/icons/buttons/TickIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';

interface Props {
  routePath?: string;
}

const RobotCard: FC<Props> = ({ routePath = '/robots-tab/algorithms/algorithm_name' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      className={clsx('rounded-[16px] border w-[342px] transition-all hover:cursor-pointer', {
        'border-regaliaPurple': !isHovered,
        'border-lightPurple': isHovered,
      })}
      onClick={() => router.push(routePath)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={'relative rounded-[16px] p-4 w-full h-full custom-bg-blur transition-all'}>
        <div className='flex justify-between items-start pb-4 border-b border-[#FFFFFF10]'>
          <div className='flex items-center gap-3'>
            <Image
              src={'/productIcon.png'}
              width={72}
              height={72}
              alt='avatar'
              className='size-[72px] rounded-lg object-cover'
            />
            <div className='flex flex-col gap-0.5'>
              <h4 className='text-[19px] font-semibold'>Sarah Lee</h4>
              <div className='flex gap-1 flex-wrap'>
                <SubCount personse={315} />
                <TagLabel value='MEDIUM ACCURACY' category='some' />
                <TagLabel value='20% PROFIT SHARING' category='good' />
              </div>
            </div>
          </div>
          <div>
            <StarIcon />
          </div>
        </div>

        <div className='flex gap-2 mt-4'>
          <Image src='/mockIcons/21.png' width={32} height={32} alt='platform-1' />
          <Image src='/mockIcons/22.png' width={32} height={32} alt='platform-2' />
          <Image src='/mockIcons/23.png' width={32} height={32} alt='platform-3' />
        </div>

        <div className='mt-4 flex flex-col gap-2'>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>PAIR:</p>
            <TagLabel value='BTC/USDT' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>MAX DRAWDOWN:</p>
            <TagLabel value='-8.2%' category='good' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>MARKET TYPE:</p>
            <TagLabel value='FuTures (x10 LEVERAGE)' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>TYPE:</p>
            <TagLabel value='STOCKS' category='none' />
            <TagLabel value='FUTURES' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>STRATEGY:</p>
            <TagLabel value='TECH ANALYSIS (MA, RSI)' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>SETTINGS:</p>
            <TagLabel value='CUSTOM INDICATORS' category='midle' />
          </div>
        </div>

        <div className='mt-6'>
          <Image src='/mockCharts/chart-1.png' width={312} height={54} alt='chart' />
        </div>

        <div className='mt-6'>
          <div className='flex gap-2 items-center'>
            <span className='text-xs font-semibold text-lighterAluminum'>CALC. APY</span>
            <span className='text-xs font-semibold text-lighterAluminum px-1.5 py-0.5 border border-lighterAluminum rounded'>
              30D
            </span>
          </div>
          <div className='mt-0.5'>
            <span className='text-bold-24 text-[#2EBD85]'>+120.33%</span>
          </div>
        </div>

        <div className='flex gap-4 mt-6'>
          <div className='w-full'>
            <Button variant='secondary' className='flex gap-2 w-full h-[26px]'>
              <LearnMoreIcon />
              Learn More
            </Button>
          </div>
          <div className='w-full'>
            <Button className='flex gap-2 w-full h-[26px]'>
              <TickIcon />
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotCard;
