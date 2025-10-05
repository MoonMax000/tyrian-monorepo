'use client';

import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { TagProps } from './types';

import VideoIcon from '@/assets/system-icons/video.svg';
import ScriptIcon from '@/assets/system-icons/softwares.svg';
import IdeaIcon from '@/assets/system-icons/idea.svg';

type TagType = { icon: ReactNode; title: string; className?: string };

const tagsVariants: Record<TagProps['type'], TagType> = {
  video: { icon: <VideoIcon />, title: 'Video', className: 'bg-[#FF6BD4]' },
  script: { icon: <ScriptIcon />, title: 'Script', className: 'bg-[#6B6BFF]' },
  ideas: { icon: <IdeaIcon />, title: 'Ideas', className: 'bg-[#4FC3F7]' },
};

const Tag: FC<TagProps> = ({ type, className }) => {
  const tag = tagsVariants[type];

  if (!tag) {
    console.warn('❌ Неизвестный тип тега:', type);
    return null;
  }

  const { icon, title } = tag;

  return (
    <div
      className={clsx(
        'flex gap-1 px-2 py-[2px] h-[22px] rounded-[4px]',
        className,
        tagsVariants[type].className,
      )}
    >
      {icon}
      <span className='text-[13px] font-bold'>{title}</span>
    </div>
  );
};

export default Tag;
