'use client';

import type { FC } from 'react';
import Image from 'next/image';

import Paper from '@/components/UI/Paper';
import Button from '@/components/UI/Button/Button';
import LogoWithName from '@/components/UI/LogoWithName';
import Rating from '@/components/UI/Rating';
import DividedRow from '@/components/UI/DividedRow';
import TagLabel from '@/components/UI/TagLabel';

import mockProfileAvatar from '@/assets/mock-profile-avatar-squared.png';
import ChatIcon from '@/assets/icons/icon-chat.svg';
import IconGeo from '@/assets/icons/icon-geo.svg';
import IconNationality from '@/assets/icons/icon-nationality.svg';
import IconSubscribers from '@/assets/icons/icon-subscribers.svg';
import IconPurpleStar from '@/assets/icons/icon-purple-star.svg';
import StarIcon from '@/assets/icons/star-icon.svg';

interface ConsultantCardHeaderProps {
  companyName: string;
  name: string;
  credentials: string[];
  location: string;
  servesNationwide: boolean;
  rating: number;
  subscribers: number;
  verified: boolean;
  description: string;
  tags: string[];
  consultationText?: string;
}

export const ConsultantHeader: FC<ConsultantCardHeaderProps> = ({
  companyName,
  name,
  credentials,
  location,
  servesNationwide,
  rating,
  subscribers,
  verified,
  description,
  tags,
  consultationText,
}) => {
  return (
    <Paper className='p-4 relative overflow-hidden -z-[0]'>
      <div
        className='absolute top-0 left-0 w-full h-full -z-[1]'
        style={{
          backgroundImage: 'url("/background/bg-ribbonSVG.svg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      />
      <button className='absolute top-4 right-4 text-lighterAluminum hover:text-white'>
        <StarIcon width={24} height={24} />
      </button>
      <div className='flex items-end gap-x-4'>
        <div className='flex flex-col gap-y-4 max-w-[312px] w-full items-center'>
          <Image
            src={mockProfileAvatar}
            alt='Sarah Lee'
            placeholder='blur'
            width={118}
            height={117}
            className='w-full object-cover rounded-[16px]'
          />
          <Button className='items-center gap-2 font-medium grow max-h-[26px] w-full' ghost>
            <ChatIcon width={16} height={16} />
            Chat
          </Button>
          {consultationText && (
            <span className='text-[15px] font-medium text-lighterAluminum'>{consultationText}</span>
          )}
        </div>
        <div className='flex flex-col gap-y-2 shrink'>
          <span className='text-[12px] uppercase font-bold'>{companyName}</span>
          <h1 className='text-[31px] font-bold'>
            {name}, {credentials.join(', ')}
          </h1>
          <div className='flex gap-x-4 items-center'>
            <LogoWithName icon={<IconGeo />} label={location} />
            {servesNationwide && (
              <LogoWithName icon={<IconNationality />} label='Serving Clients Nationwide' />
            )}
          </div>
          <DividedRow gap={4}>
            <Rating value={rating} disabled />
            <LogoWithName icon={<IconSubscribers />} label={subscribers.toString()} />
            {verified && (
              <span className='text-[12px] uppercase font-bold flex items-center gap-x-2'>
                verified
                <IconPurpleStar />
              </span>
            )}
          </DividedRow>
          <div className='flex flex-col gap-y-2 mt-9'>
            <p className='text-[15px] font-bold'>{description}</p>
            <div className='flex items-center gap-2 flex-wrap'>
              {tags.map((tag) => (
                <TagLabel value={tag} key={tag} category='midle' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};
