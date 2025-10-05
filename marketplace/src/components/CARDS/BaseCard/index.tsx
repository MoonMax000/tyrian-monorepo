import type { FC, PropsWithChildren } from 'react';

import Paper from '@/components/UI/Paper';

import ScriptIcon from '@/assets/mock/mock-script.svg';

import { cn } from '@/utils/cn';

export interface IBaseCardProps extends PropsWithChildren {
  withTitleImg?: boolean;
  className?: string;
}

const BaseCard: FC<IBaseCardProps> = ({ children, className, withTitleImg = false }) => {
  return (
    <Paper className={cn(className, 'overflow-hidden')}>
      {withTitleImg && (
        <div className='border-b-[1px] border-regaliaPurple overflow-hidden'>
          <ScriptIcon className='w-full' />
        </div>
      )}
      {children}
    </Paper>
  );
};

export default BaseCard;
