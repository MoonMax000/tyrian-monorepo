import { cn } from '@/utilts/cn';
import React from 'react';

type BreadcrumbsProps = {
  items: string[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className='flex items-center text-[12px] font-[700] '>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <span
            className={cn(
              'text-[#B0B0B0] cursor-pointer hover:text-primary',
              i === items.length - 1 && 'text-primary',
            )}
          >
            {item}
          </span>
          {i < items.length - 1 && <span className='px-1'>/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
