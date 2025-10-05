import { FC, useState } from 'react';
import Button from '@/components/UI/Button/Button';
import clsx from 'clsx';
import Image from 'next/image';
import mockProfileAvatar from '@/assets/mock-profile-avatar-squared.png';
import LogoWithName from '@/components/UI/LogoWithName';
import IconGeo from '@/assets/icons/icon-geo.svg';
import IconNationality from '@/assets/icons/icon-nationality.svg';
import IconPurpleStar from '@/assets/icons/icon-purple-star.svg';
import StarIcon from '@/assets/icons/star-icon.svg';
import ContactIcon from '@/assets/icons/buttons/contactHireButton.svg';
import TagLabel from '@/components/UI/TagLabel';

interface Props {
  onClick?: () => void;
}

const ConsultantCard: FC<Props> = ({ onClick }) => {
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
      <div
        className={
          'relative rounded-[16px] p-4 w-full h-full bg-[#181A20] transition-all custom-bg-blur'
        }
      >
        <div
          className='absolute top-0 left-0 w-full h-[192px] z-[-1] rounded-t-[16px] bg-gradient-to-b from-[#00000000] to-[#000000] backdrop-blur-[100px]'
          style={{
            backgroundImage: 'url("/background/bg-ribbonSVG.svg")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />
        <div className='flex flex-col gap-2'>
          <div className='flex items-start justify-between'>
            <div className='relative left-[-8px]'>
              <Image src={mockProfileAvatar.src} alt='profile' width={96} height={96} />
            </div>

            <StarIcon />
          </div>
          <div className='z-10'>
            <div className='flex flex-start items-center gap-[4px] mb-1'>
              <p className='text-[19px] font-semibold '>Sarah Lee, CFP®</p>
              <IconPurpleStar className='mr-[10px]' />
            </div>
            <p className='text-[12px] font-semibold text-lighterAluminum uppercase'>
              SONMORE FINANCIAL
            </p>
          </div>
          <div className='flex gap-4 py-1 text-[11.25px] font-semibold z-10'>
            <LogoWithName icon={<IconGeo />} label='Chandler, AZ' />
            <LogoWithName icon={<IconNationality />} label='Nationwide' />
          </div>
          <p className='text-body-15'>
            Helping Retirees and Professionals in Aerospace and Tech Minimize Taxes
          </p>
          <div className='flex flex-start gap-1'>
            <div className='font-semibold text-[12px] text-lighterAluminum'>Number of Clients</div>
            <div className='font-semibold text-[12px]'>232</div>
          </div>
          <div className='flex flex-start gap-1'>
            <div className='font-semibold text-[12px] text-lighterAluminum'>Risk Level</div>
            <div className='font-semibold text-[12px]'>Moderate</div>
          </div>
        </div>
        <div className='flex gap-2 mt-6 pb-4 border-b border-[#FFFFFF10]'>
          <Button className='!font-medium h-[26px] flex-1 gap-[8px] text-body-12'>
            <ContactIcon width={16} height={16} />
            Contact/Hire
          </Button>
        </div>
        <div className='flex gap-[6px] mt-4 pb-4 border-b border-[#FFFFFF10]'>
          <div className='font-semibold text-[15px]'>Assets Under Management (AUM)</div>
          <span className='text-freshGreen'> $4.2M </span>
        </div>
        <div className='flex gap-[6px] mt-4'>
          <div className='font-semibold text-[15px]'>Average Portfolio Return</div>
          <TagLabel value='+0.00%' category='good' />
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;
