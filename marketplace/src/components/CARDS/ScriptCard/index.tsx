import { FC, ReactNode, useState } from 'react';
import clsx from 'clsx';
import StarIcon from '@/assets/icons/star-icon.svg';
import TagLabel from '../../UI/TagLabel';
import Button from '../../UI/Button/Button';
import BuyIcon from '@/assets/icons/BuyIcon.svg';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';
import TrailIcon from '@/assets/icons/trailIcon.svg';
import MessageIcon from '@/assets/icons/messageIcon.svg';
import YellowStarIcon from '@/assets/icons/yellowStarIcon.svg';

interface ScriptCardProps {
  title: string;
  icon?: ReactNode;
  iconProfile?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
}

const compatibility = ['MetaTrader 4', 'MetaTrader 5', 'MetaTrader 6'];
const requirements = ['Python 3.8+', 'numpy', 'pandas'];
const bottomStats = [
  { label: 'Type:', value: <TagLabel value='Script' category='none' /> },
  { label: 'Industry', value: <TagLabel value='Trading and Finance' category='midle' /> },
  { label: 'Publication Date', value: <TagLabel value='2 years ago' category='none' /> },
  { label: 'Revenue', value: <TagLabel value='USD $15,000/Month' category='none' /> },
];

const ScriptCard: FC<ScriptCardProps> = ({ title, icon, iconProfile, action, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx(
        'rounded-[16px] border p-4 w-full flex flex-col gap-[26px] shadow-sm bg-custom-dark hover:cursor-pointer',
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
        {icon && <div className='flex w-80 h-80'>{icon}</div>}
        <div className='flex flex-col gap-4 w-full '>
          <div className='top-4 flex w-full gap-2 items-start justify-between '>
            <div className='flex gap-2 items-center'>
              {iconProfile && (
                <div className='flex w-[64px] h-[64px] rounded-[8px]'>{iconProfile}</div>
              )}
              <div className='flex flex-col gap-[2px]'>
                <span className='text-[19px] font-semibold'>{title}</span>
                {action && <div className='flex'>{action}</div>}
              </div>
            </div>
            <div>
              <StarIcon />
            </div>
          </div>
          <div className='w-full h-[1px] bg-regaliaPurple'></div>
          <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
              <span className='text-[19px] font-semibold'>
                RiskMaster - Trading risk calculation script
              </span>
              <div className='flex gap-2'>
                <div className='flex gap-1 text-orange'>
                  <TrailIcon />
                  <div className='text-[12px] font-semibold'>1.5K</div>
                </div>
                <div className='flex gap-1 text-orange'>
                  <MessageIcon />
                  <div className='text-[12px] font-semibold'>563</div>
                </div>
              </div>
            </div>
            <div className='flex justify-between'>
              <div className='flex gap-2 items-center'>
                <TagLabel value='Verified Listing' category='strange' />
                <span className='flex items-end uppercase text-body-12 font-semibold'>
                  🌍 Australia
                </span>
              </div>
              <div className='flex gap-2'>
                {[...Array(5)].map((_, i) => (
                  <YellowStarIcon key={i} />
                ))}
                <div className='text-[12px] font-semibold'>5/5</div>
              </div>
            </div>
            <p className='max-w-[511px] text-[15px] font-semibold mt-2 mb-4'>
              RiskMaster – powerful tool for traders, automatically calculates trade risks. Optimize
              trading and minimize losses!
            </p>
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-1'>
                <span className='text-[12px] font-semibold uppercase text-lighterAluminum'>
                  Compatibility:
                </span>
                {compatibility.map((item) => (
                  <TagLabel key={item} value={item} category='none' />
                ))}
              </div>
              <div className='flex items-center gap-1'>
                <span className='text-[12px] font-semibold uppercase text-lighterAluminum'>
                  Requirements:
                </span>
                {requirements.map((item) => (
                  <TagLabel key={item} value={item} category='none' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex gap-8'>
          {bottomStats.map(({ label, value }) => (
            <div key={label} className='flex flex-col gap-1'>
              <span className='text-[12px] font-semibold uppercase text-lighterAluminum'>
                {label}
              </span>
              {value}
            </div>
          ))}
        </div>
        <div className='flex gap-4 mt-6'>
          <div className='w-full'>
            <Button variant='secondary' className='flex gap-2 w-[180px] h-[32px]'>
              <LearnMoreIcon />
              Details
            </Button>
          </div>
          <div className='w-full'>
            <Button className='flex gap-2 w-[180px] h-[32px]'>
              <BuyIcon />
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptCard;
