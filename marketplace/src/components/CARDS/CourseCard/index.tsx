import { FC, ReactNode, useState } from 'react';
import clsx from 'clsx';
import StarIcon from '@/assets/icons/star-icon.svg';
import TagLabel from '../../UI/TagLabel';
import Button from '../../UI/Button/Button';
import SubCount from '@/components/UI/SubCount';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';

interface CourseCardProps {
  icon?: ReactNode;
  onClick?: () => void;
}

const CourseCard: FC<CourseCardProps> = ({ icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx(
        'rounded-[16px] p-4 w-full border flex flex-col gap-[26px] shadow-sm  hover:cursor-pointer custom-bg-blur',
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
        {icon && <div className=''>{icon}</div>}
        <div className='flex justify-between w-full'>
          <div className='flex flex-col gap-5'>
            <div>
              <h4 className='text-[24px] font-semibold'>Expert Futures Trading</h4>
              <p className='text-sh1 text-lighterAluminum'>Expert Trading Training</p>
            </div>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1'>
                <span className='text-xs font-semibold uppercase text-lighterAluminum'>HOST:</span>
                <span className='text-xs font-semibold'>Sarah Lee</span>
                <SubCount personse={1.748} />
                <span className='bg-[#1C3430] text-xs font-semibold text-green p-1 rounded-md'>
                  4.3
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-xs font-semibold uppercase text-lighterAluminum'>TOTAL:</span>
                <span className='text-body-15'>Sarah Lee</span>
                <TagLabel value='4.5H' category='none' />
                <TagLabel value='17 LEctures' category='none' />
                <TagLabel value='All LEVELS' category='midle' />
              </div>
            </div>
          </div>
          <div className='flex flex-col h-full items-end justify-between'>
            <StarIcon />

            <div className='flex gap-4 mt-6'>
              <Button variant='secondary' className='flex flex-1 gap-2 w-[180px] h-[26px]'>
                <LearnMoreIcon />
                Details
              </Button>
              <Button className='flex flex-1 gap-2 w-[180px] h-[26px]'>
                <BuyIcon />
                Add to cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
