import React from 'react'
import { ProgressBar } from '@/components/ui/ProgressBar/ProgressBar';

interface ProgresCardProps {
    title: string;
    value: number;
}

function ProgresCard({ title, value }: ProgresCardProps) {
  return (
    <div className='flex flex-col items-center justify-between h-10'>
      <div className='w-full flex items-center justify-between'>
        <span className='text-[12px] font-bold text-lighterAluminum uppercase'>{title}</span>
        <span className='text-[12px] font-bold text-lighterAluminum'>{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

export default ProgresCard
