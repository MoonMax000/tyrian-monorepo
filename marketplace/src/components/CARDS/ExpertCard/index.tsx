import type { FC } from 'react';
import Image from 'next/image';

import Paper from '@/components/UI/Paper';
import Button from '@/components/UI/Button/Button';
import TagLabel from '@/components/UI/TagLabel';

import XIcon from '@/assets/icons/social-networks/x-stroked.svg';
import YoutubeIcon from '@/assets/icons/social-networks/youtube-stroked.svg';
import InstagramIcon from '@/assets/icons/social-networks/instagram-stroked.svg';
import PlanetIcon from '@/assets/icons/social-networks/planet.svg';

import { cn } from '@/utils/cn';

export type Expert = {
  name: string;
  avatar: string;
  description: string;
  tags: string[];
  isPro: boolean;
};

interface IExpertCard {
  expert: Expert;
  className?: string;
}

const contactsMock = [XIcon, YoutubeIcon, InstagramIcon, PlanetIcon];

const ExpertCard: FC<IExpertCard> = ({ expert, className }) => {
  const { name, avatar, description, tags, isPro } = expert;

  return (
    <Paper className={cn('p-4', className)}>
      <div className='flex items-center gap-x-2'>
        <Image src={avatar} width={80} height={80} alt={name} className='rounded-full' />
        <div className='flex flex-col gap-y-2'>
          <div className='flex items-center gap-x-1'>
            <span>{name}</span>
            {isPro && (
              <span className='bg-purple px-1 rounded-md text-[12px] font-extrabold'>PRO</span>
            )}
          </div>
          <Button className='max-h-[26px]'>Follow</Button>
        </div>
      </div>
      <div className='flex flex-col gap-y-4 mt-4'>
        <span className='text-lighterAluminum text-[15px] font-bold'>
          Join our 10k+ community:
          <span className='text-purple hover:underline cursor-pointer'> example.com</span>
        </span>
        <p className='text-lighterAluminum text-[15px] font-bold'>{description}</p>
        <div className='flex items-center gap-x-3 text-lighterAluminum text-[15px] font-bold'>
          <span>Also on:</span>
          <ul className='flex items-center gap-3 flex-wrap'>
            {contactsMock.map((Icon, index) => (
              <li key={index} className='cursor-pointer'>
                <Icon />
              </li>
            ))}
          </ul>
        </div>
        <ul className='flex items-center gap-3 flex-wrap'>
          {tags.map((tag) => (
            <li key={tag}>
              <TagLabel value={tag} category='none' />
            </li>
          ))}
        </ul>
      </div>
    </Paper>
  );
};

export default ExpertCard;
