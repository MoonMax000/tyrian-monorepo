import React, { useState } from 'react';
import profilePhoto from '@/assets/mock-avatars/avatar-mock.jpg';
import Avatar from '../ui/Avatar/Avatar';
import { PositiveNegativeTrend } from '../MarketTags/PositiveNegativeTrend';
import Button from '../ui/Button/Button';
import EmojiIcon from '@/assets/system-icons/EmojiIcon.svg';
import GIFIcon from '@/assets/system-icons/GIFIcon.svg';
import PictureIcon from '@/assets/system-icons/PictureIcon.svg';
import RedactorButton from '@/assets/system-icons/redactorButton.svg';
import ButtonWrapper from '../ui/ButtonWrapper/ButtonWrapper';

export default function CreatePostBox() {
  const [text, setText] = useState('');

  return (
    <div className='rounded-[24px] border border-regaliaPurple p-4 flex flex-col gap-4 shadow-lg backdrop-blur-md'>
      <div className='flex items-center gap-3'>
        <Avatar src={profilePhoto} fallback='AB' size='small' />
        <input
          type='text'
          placeholder='How do you feel about markets today? Share your ideas here!'
          className='flex-1 h-[44px] bg-transparent outline-none text-white placeholder:text-lighterAluminum border-[1px] border-gunpowder rounded-[16px] px-3 py-2'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <ButtonWrapper className='border-none'>
          <RedactorButton className={'text-lighterAluminum hover:text-white'} />
        </ButtonWrapper>
      </div>
      <div className='flex justify-between items-center gap-4'>
        <div className='flex items-center gap-[8px]'>
          <PositiveNegativeTrend
            isPositive={true}
            contained={true}
            className='text-[12px] font-[800]'
          >
            Bullish
          </PositiveNegativeTrend>
          <div className='w-px h-6 bg-regaliaPurple mx-2 opacity-60'></div>
          <PositiveNegativeTrend isPositive={false} className='text-[12px] font-[800]'>
            Bearish
          </PositiveNegativeTrend>
          <PictureIcon className='w-[20px] h-[20px]' />
          <EmojiIcon className='w-[20px] h-[20px]' />
          <GIFIcon className='w-[20px] h-[20px]' />
        </div>
        <Button className='w-[70px] h-[32px] py-[6px] px-[8px] text-xs'>Post</Button>
      </div>
    </div>
  );
}
