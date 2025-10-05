'use client';

import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { TagProps } from './types';

import VideoIcon from '@/assets/icons/video.svg';
import ScriptIcon from '@/assets/icons/script.svg';
import IdeaIcon from '@/assets/icons/icon-idea.svg';

type TagType = { icon: ReactNode; title: string; className?: string };

const tagsVariants: Record<TagProps['type'], TagType> = {
  videos: { icon: <VideoIcon />, title: 'Video', className: 'bg-[#FF6BD4]' },
  softwares: { icon: <ScriptIcon />, title: 'Software', className: 'bg-[#6B6BFF]' },
  ideas: { icon: <IdeaIcon />, title: 'Ideas', className: 'bg-[#4FC3F7]' },
  opinions: { icon: <IdeaIcon />, title: 'Opinion', className: 'bg-[#FF6B6B]' },
  analytics: { icon: <IdeaIcon />, title: 'Analytics', className: 'bg-[#F7A350]' },
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
