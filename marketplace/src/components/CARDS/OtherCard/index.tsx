import { FC, ReactNode, useState } from 'react';
import clsx from 'clsx';
import StarIcon from '@/assets/icons/star-icon.svg';
import TagLabel from '../../UI/TagLabel';
import Button from '../../UI/Button/Button';
import Image from 'next/image';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';

interface OtherCardProps {
  icon?: string;
  iconProfile?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
}

const OtherCard: FC<OtherCardProps> = ({ icon, iconProfile, action, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={clsx(
        'rounded-[16px] border p-4 w-full flex flex-col gap-[26px] shadow-sm custom-bg-blur hover:cursor-pointer',
        {
          'border-regaliaPurple': !isHovered,
          'border-lightPurple': isHovered,
        },
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex gap-4'>
        <div className='relative flex-none'>
          {icon && (
            <Image
              src={icon}
              width={451}
              height={264}
              alt='icon'
              className='w-[451px] h-[264px] rounded-[8px]'
            />
          )}
          <div className='absolute top-[237px] left-[5px] z-10'>
            <span className='bg-gunpowder text-xs font-semibold py-[2px] px-1 rounded-md uppercase'>
              Windows/MAC
            </span>
          </div>
        </div>
        <div className='flex flex-col w-full justify-between'>
          <div className='flex w-full  gap-2 items-start justify-between border-b border-[#FFFFFF10] pb-[20px]'>
            <div className='flex gap-2 items-center'>
              {!!iconProfile && iconProfile}
              <div className='flex flex-col gap-[2px]'>
                <div className='flex items-center gap-2'>
                  <p className='text-2xl font-semibold mb-1'>Product Name</p>
                  <span className='bg-lightPurple text-xs font-semibold px-1 rounded-md'>PRO</span>
                </div>
                {action && <div className='flex'>{action}</div>}
              </div>
            </div>
            <StarIcon />
          </div>
          <div className='flex items-end justify-between w-full'>
            <div className='flex flex-col gap-5'>
              <div>
                <p className='text-[19px] font-semibold'>Auto Script - Automation script</p>
                <p className='text-[15px] font-semibold'>
                  RiskMaster – powerful tool for traders, automatically calculates trade risks.
                  Optimize trading and minimize losses!
                </p>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-xs font-semibold uppercase text-webGray'>Type:</span>
                <TagLabel value='Script' category='none' />
                <span className='text-xs font-semibold uppercase text-webGray'>Industry:</span>
                <TagLabel value='Automation' category='midle' />
              </div>
            </div>
          </div>
          <div className='flex gap-4 mt-6'>
            <Button variant='secondary' className='flex  flex-1 gap-2 h-[26px]'>
              <LearnMoreIcon />
              Details
            </Button>
            <Button className='flex  flex-1 gap-2 h-[26px]'>
              <BuyIcon />
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherCard;
