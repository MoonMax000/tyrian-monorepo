import React from 'react'
import { cn } from '@/utilts/cn';
import { PercentLabel } from '@/components/ui/PercentLabel/PercentLabel';

interface CardProps {
  title: string;
  value: string;
  progress: number;
  textNote: string;
  wrapperClassName?: string;
}

function Card({
  title,
  value,
  progress,
  textNote,
  wrapperClassName,
}: CardProps) {
  return (
    <div
      className={cn(
        'p-4 container-card flex flex-col justify-between',
        wrapperClassName,
      )}
    >
      <div className='flex flex-col gap-0'>
        <span className='text-[12px] font-bold text-lighterAluminum uppercase'>
          {title}
        </span>
        <span>{value}</span>
      </div>
      <div className='flex gap-1 items-center'>
        <PercentLabel
          value={progress}
          isNeedCover
          className='text-[12px] font-extrabold'
        />
        <span className='text-primary uppercase text-[12px] font-bold'>
          {textNote}
        </span>
      </div>
    </div>
  );
}

export default Card
