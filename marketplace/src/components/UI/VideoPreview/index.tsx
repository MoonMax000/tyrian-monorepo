import type { FC } from 'react';
import Image from 'next/image';

import { cn } from '@/utils/cn';

import IconPlay from '@/assets/icons/icon-play.svg';

interface IShortVideoProps {
  src: string;
  className?: string;
}

const VideoPreview: FC<IShortVideoProps> = ({ src, className }) => (
  <div className={cn('relative', className)}>
    <Image src={src} alt='short video' width={1500} height={1000} className='w-full object-cover' />
    <button className='rounded-full bg-gradient-to-l from-lightPurple to-darkPurple size-16 flex items-center justify-center shadow-[0px_12px_24px_0px_rgba(0,0,0,0.48)] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
      <IconPlay width={24} height={24} />
    </button>
  </div>
);

export default VideoPreview;
