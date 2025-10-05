import { cn } from '@/utilts/cn';
import { FC, ReactNode } from 'react';

export type StatusType = 'green' | 'purple' | 'red';

interface StatusIndicatorProps {
  status: StatusType;
  className?: string;
  children: ReactNode;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status, className, children }) => {
  return (
    <div
      className={cn(
        'text-center',
        status === 'green' && 'text-green',
        status === 'purple' && 'text-lightPurple',
        status === 'red' && 'text-red',
        className,
      )}
    >
      {children}
    </div>
  );
};
