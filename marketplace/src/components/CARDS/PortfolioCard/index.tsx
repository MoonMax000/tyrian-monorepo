import { FC, useState } from 'react';
import Image from 'next/image';
import Button from '@/components/UI/Button/Button';
import clsx from 'clsx';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import StarIcon from '@/assets/icons/star-icon.svg';
import TickIcon from '@/assets/icons/buttons/TickIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';

interface Props {
  onClick?: () => void;
}

const PortfolioCard: FC<Props> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx('p-[1px] rounded-[16px] border w-[342px] transition-all', {
        'border-regaliaPurple': !isHovered,
        'border-lightPurple': isHovered,
      })}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={'relative rounded-[16px] p-4 w-full h-full transition-all custom-bg-blur'}>
        <div className='flex justify-between items-start pb-4'>
          <div className='flex gap-3'>
            <Image
              src={'/productIcon.png'}
              width={72}
              height={72}
              alt='avatar'
              className='size-[72px] rounded-lg object-cover'
            />

            <div className='flex flex-col gap-0.5'>
              <h4 className='text-[19px] font-semibold'>Product Name</h4>
              <div className='flex gap-1 flex-wrap'>
                <SubCount personse={315} />
                <TagLabel value='RISK: MEDIUM' category='some' />
                <TagLabel value='20% PROFIT SHARING' category='good' />
              </div>
            </div>
          </div>
          <div>
            <StarIcon />
          </div>
        </div>

        <div className='flex gap-2 mt-4'>
          <Image src='/mockIcons/24.png' width={32} height={32} alt='platform-1' />
          <Image src='/mockIcons/25.png' width={32} height={32} alt='platform-2' />
          <Image src='/mockIcons/26.png' width={32} height={32} alt='platform-3' />
          <Image src='/mockIcons/27.png' width={32} height={32} alt='platform-4' />
          <Image src='/mockIcons/28.png' width={32} height={32} alt='platform-5' />
          <div className='w-[32px] h-[32px] bg-[#313338] text-xs font-semibold rounded-full flex items-center justify-center'>
            +30
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-2'>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>EXCHANGES:</p>
            <TagLabel value='ALL' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>ASSETS:</p>
            <TagLabel value='STOCKS' category='none' />
            <TagLabel value='BONDS' category='none' />
            <TagLabel value='ETFS' category='none' />
            <TagLabel value='CRYPTO' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>STRATEGY:</p>
            <TagLabel value='MOMENTUM BREAKOUT' category='none' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>MAX DRAWNDOWN:</p>
            <TagLabel value='15%' category='strange' />
          </div>
          <div className='flex gap-1 items-center'>
            <p className='text-xs font-semibold text-lighterAluminum'>MIN. CAPITAL:</p>
            <TagLabel value='$1000' category='strange' />
          </div>
        </div>

        <div className='mt-4 pt-4 flex gap-[59px]  border-t border-regaliaPurple'>
          <div>
            <div className='flex gap-2 items-center'>
              <span className='text-[12px] font-semibold text-lighterAluminum'>ROI (30D):</span>
              <span className='text-[12px] font-semibold text-green'>+60.33%</span>
            </div>
          </div>
          <div>
            <div className='flex gap-2 items-center'>
              <span className='text-[12px] font-semibold text-lighterAluminum'>ROI (1Y):</span>
              <span className='text-[12px] font-semibold text-green'>+120.83%</span>
            </div>
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

export default PortfolioCard;
