import React from 'react';
import clsx from 'clsx';

import Paper from '@/components/UI/Paper';

interface DescriptionCardProps {
  title: string;
  icon?: React.ReactNode;
  hoverContent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

const DescriptionCard = ({
  title,
  icon,
  hoverContent,
  children,
  className,
  contentClassName,
}: DescriptionCardProps) => {
  return (
    <Paper className={className}>
      <div className='p-4 w-full flex items-center gap-2 text-purple text-sh1 border-b border-gunpowder px-4 pb-4'>
        {title}
        {icon && (
          <div className='relative group hover:cursor-pointer'>
            <span>{icon}</span>
            {hoverContent && (
              <div className='absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10 hidden group-hover:block'>
                {hoverContent}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={clsx('text-body-15 p-4', contentClassName)}>{children}</div>
    </Paper>
  );
};

export default DescriptionCard;
