import { FC, useState } from 'react';
import Button from '@/components/UI/Button/Button';
import clsx from 'clsx';
import ProcentLabel from '@/components/UI/ProcentLabel';
import ProfileAvatar from '@/assets/Снимок экрана 2025-03-28 в 20.31.17 3.png';
import StarIcon from '@/assets/icons/star-icon.svg';
import TagLabel from '@/components/UI/TagLabel';
import SubCount from '@/components/UI/SubCount';
import MockChart from '@/assets/bg-chart.svg';
import Image from 'next/image';
import NotesCount from '@/components/UI/NotesCount';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';
import ContactIcon from '@/assets/icons/buttons/contactHireButton.svg';

const infoData = [
  { label: 'Markets', value: 'Binance, NASDAQ' },
  { label: 'Assets', value: 'BTC, ETH, Tesla, Gold' },
  { label: 'Analysis', value: 'Technical & Fundamental Analysis' },
];

interface Props {
  onClick?: () => void;
}

const AnalystsCard: FC<Props> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx('rounded-[16px] border w-[342px] transition-all', {
        'border-regaliaPurple': !isHovered,
        'border-lightPurple': isHovered,
      })}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={'relative rounded-[16px] p-4 w-full h-full custom-bg-blur transition-all'}>
        <div className='relative flex flex-col gap-2 pb-4'>
          <div className='absolute bottom-2 left-0 w-full pointer-events-none select-none z-[-1] '>
            <MockChart />
          </div>
          <div className='flex flex-1 justify-between items-start'>
            <Image
              src={ProfileAvatar.src}
              width={96}
              height={96}
              sizes='96px'
              alt='avatar'
              className='w-[96px] h-[96px] rounded-full object-cover'
            />
            <StarIcon />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-2xl font-semibold mb-1'>Sarah Lee</p>
              <span className='bg-lightPurple text-xs font-semibold px-1 rounded-md'>PRO</span>
            </div>
            <p className='text-xs font-semibold text-lighterAluminum uppercase'>
              Berkshire Hathaway
            </p>
          </div>
          <div>
            <div className='flex gap-1 items-center'>
              <TagLabel value='Hedge fund manager' category='some' classname='text-[12px]' />
              <span className='bg-[#1C3430] text-xs font-semibold text-green p-1 rounded-md'>
                5.0
              </span>
              <SubCount personse={15.054} />
              <NotesCount notes={983} />
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2 border-b border-[#FFFFFF17] pb-4 z-10'>
          {infoData.map(({ label, value }) => (
            <div key={label}>
              <span className='text-[12px] !font-semibold text-lighterAluminum uppercase mr-[4px]'>
                {label}:
              </span>
              <span className='text-[12px] !font-semibold uppercase'>{value}</span>
            </div>
          ))}
        </div>

        <div className='flex gap-1 items-center pt-4'>
          <p className='text-xs text-lighterAluminum uppercase font-semibold'>Forecast Accuracy:</p>
          <ProcentLabel value={88.12} />
        </div>
        <div className='flex gap-2 mt-6'>
          <div className='w-full'>
            <Button
              variant='secondary'
              className=' !font-semibold flex gap-2 w-full h-[26px] text-[12px]'
            >
              <LearnMoreIcon />
              Learn More
            </Button>
          </div>
          <div className='w-full'>
            <Button className='!font-semibold flex gap-2 w-full h-[26px] text-[12px]'>
              <ContactIcon width={16} height={16} />
              Contact/Hire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalystsCard;
