import { FC, useState } from 'react';
import clsx from 'clsx';
import StarIcon from '@/assets/icons/star-icon.svg';
import MockChart from '@/assets/mock/mock-chart.svg';
import Image from 'next/image';
import Button from '@/components/UI/Button/Button';
import mockProfileAvatar from '@/assets/mock-profile-avatar-squared.png';
import ProcentLabel from '@/components/UI/ProcentLabel';
import TagLabel from '@/components/UI/TagLabel';
import SubCount from '@/components/UI/SubCount';
import NotesCount from '@/components/UI/NotesCount';
import LearnMoreIcon from '@/assets/icons/LearnMoreIcon.svg';
import ContactIcon from '@/assets/icons/buttons/contactHireButton.svg';

const tradersData = [
  [
    {
      label: 'ROI(Month)',
      value: <ProcentLabel value={28.4} />,
      gap: 'gap-1',
    },
    {
      label: 'Average Trade Profitability:',
      value: <ProcentLabel value={4.2} />,
      gap: 'gap-[2px]',
    },
  ],
  [
    {
      label: 'ROI(3 Months)',
      value: <ProcentLabel value={28.4} />,
      gap: 'gap-1',
    },
    {
      label: 'Trades Accuracy',
      value: <span className='text-green text-[12px] font-[700]'>74%</span>,
      gap: 'gap-[4px]',
    },
  ],
];

interface Props {
  onClick?: () => void;
}

const TradersCard: FC<Props> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={clsx('p-[1px] rounded-[16px] border w-[526px] transition-all', {
        'border-regaliaPurple': !isHovered,
        'border-lightPurple': isHovered,
      })}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative rounded-[16px] p-4 w-full h-full custom-bg-blur transition-all`}>
        <div className='flex items-start justify-between pb-4'>
          <div className='flex flex-1'>
            <div className='relative left-[-8px]'>
              <Image
                src={mockProfileAvatar.src}
                alt='profile'
                width={120}
                height={120}
                className='rounded-[16px]'
              />
              <div className='absolute bottom-2 left-2 flex gap-2'>
                <span className='bg-purple text-xs px-1 rounded-md'>PRO</span>
                <span className='bg-[#1C3430] text-xs text-green px-1 rounded-md'>5.0</span>
              </div>
            </div>
            <div className='flex flex-1 flex-col justify-between'>
              <div className='relative flex flex-1 items-start justify-between'>
                <div>
                  <h4 className='text-[15px] font-semibold mb-1'>Sarah Lee</h4>
                  <div className='flex flex-start gap-[5px] mb-4'>
                    <TagLabel value='Securities Trading (USA)' category='some' />
                    <SubCount personse={15054} />
                    <NotesCount notes={983} />
                  </div>
                  <div className=''>
                    <p className='text-xs font-semibold  text-lighterAluminum uppercase mb-1'>
                      Number of Trades in 30 days: <span className='text-green'>45</span>
                    </p>
                    <p className='text-xs font-semibold text-lighterAluminum uppercase'>
                      Experience: <span className='text-green uppercase'>5 years</span>
                    </p>
                  </div>
                </div>

                <StarIcon />

                <MockChart className='absolute bottom-[-15px]' />
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-[2.3fr_2fr] gap-[8px] my-[16px]'>
          {tradersData.map((col, colIdx) => (
            <div key={colIdx} className='flex flex-col items-start gap-[8px]'>
              {col.map(({ label, value, gap }) => (
                <div key={label} className={`flex items-center ${gap}`}>
                  <div className='text-[12px] font-semibold text-lighterAluminum uppercase'>
                    {label}
                  </div>
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className='text-4 text-[12px] font-semibold'>
          Series 7 (General Securities Representative)
        </p>
        <div className='flex gap-2 mt-4'>
          <div className='w-full'>
            <Button variant='secondary' className='flex gap-2 w-full h-[26px] !font-semibold'>
              <LearnMoreIcon />
              Learn More
            </Button>
          </div>
          <div className='w-full'>
            <Button className='flex gap-2 w-full h-[26px] !font-semibold'>
              <ContactIcon width={16} height={16} />
              Contact/Hire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradersCard;
