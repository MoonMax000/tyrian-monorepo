import { FC, MouseEventHandler, useState } from 'react';
import clsx from 'clsx';
import StarIcon from '@/assets/icons/star-icon.svg';
import MockProfileAvatar from '@/assets/Снимок экрана 2025-03-28 в 20.31.17 3.png';
import Image from 'next/image';
import SubCount from '@/components/UI/SubCount';
import TagLabel from '@/components/UI/TagLabel';
import Button from '@/components/UI/Button/Button';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';

interface Props {
  handleClick?: MouseEventHandler<HTMLDivElement>;
}

const SignalCard: FC<Props> = ({ handleClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx('p-[1px] rounded-[16px] border w-[525px] transition-all', {
        'border-regaliaPurple': !isHovered,
        'border-lightPurple': isHovered,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={
          'relative rounded-[16px] p-4 w-full h-full bg-[#181A20] transition-all duration-500 custom-bg-blur'
        }
      >
        <div className='flex items-start justify-between pb-4 border-b border-[#FFFFFF10]'>
          <div className='flex gap-3 items-center'>
            <Image
              src={'/productIcon.png'}
              width={72}
              height={72}
              alt='avatar'
              className='size-[72px] rounded-lg object-cover'
            />
            <div>
              <h4 className='text-[19px] font-semibold'>Product Name</h4>
              <div className='flex gap-[4px]'>
                <SubCount personse={1748} />
                <TagLabel value='RISK: LOW' category='good' />
              </div>
            </div>
          </div>

          <StarIcon />
        </div>
        <div className='mt-4'>
          <div className='flex justify-between items-start'>
            <div>
              <div className='flex gap-2'>
                <Image src='/mockIcons/17.png' width={32} height={32} alt='1' />
                <Image src='/mockIcons/18.png' width={32} height={32} alt='1' />
                <Image src='/mockIcons/19.png' width={32} height={32} alt='1' />
                <Image src='/mockIcons/20.png' width={32} height={32} alt='1' />
              </div>
              <div className='flex flex-col gap-2 mt-4'>
                <div className='flex gap-1 items-center'>
                  <p className='text-[12px] font-semibold text-lighterAluminum'>ASSETS:</p>
                  <TagLabel value='STOCKS' category='none' />
                  <TagLabel value='CRYPTO' category='none' />
                  <TagLabel value='COMMODITIES' category='none' />
                  <TagLabel value='+1' category='none' />
                </div>
                <div className='flex gap-1 items-center'>
                  <p className='text-[12px] font-semibold text-lighterAluminum'>TYPE:</p>
                  <TagLabel value='TREND/OSCILLATOR' category='none' />
                </div>
                <div className='flex gap-1 items-center'>
                  <p className='text-[12px] font-semibold text-lighterAluminum'>TIMEFRAME:</p>
                  <TagLabel value='M15' category='midle' />
                  <TagLabel value='H4' category='midle' />
                  <TagLabel value='W1' category='midle' />
                </div>
                <div className='flex gap-1 items-center'>
                  <p className='text-[12px] font-semibold text-lighterAluminum'>USE:</p>
                  <TagLabel value='TREND/REVERSAL' category='none' />
                </div>
                <div className='flex gap-1 items-center'>
                  <p className='text-[12px] font-semibold text-lighterAluminum'>
                    PRODUCT ACCURACY:
                  </p>
                  <div className='text-green text-[15px] font-[700]'>30%</div>
                </div>
              </div>
            </div>
            <div>
              <Image
                src='/mockCharts/chart.png'
                width={189}
                height={107}
                className={'rounded-4'}
                alt='chart'
              />
            </div>
          </div>
        </div>
        <div className='flex gap-4 mt-6'>
          <div className='w-full'>
            <Button variant='secondary' className='flex gap-2 w-full h-[26px] !font-semibold'>
              <LearnMoreIcon />
              Learn More
            </Button>
          </div>
          <div className='w-full'>
            <Button className='flex gap-2 w-full h-[26px] !font-semibold'>
              <BuyIcon />
              Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
