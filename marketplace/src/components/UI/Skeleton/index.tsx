import type { FC } from 'react';
import clsx from 'clsx';
import type { SkeletonProps } from './types';

const skeletonBaseStyles = 'bg-[#DADCDD] animate-pulse';

const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => {
  switch (props.variant) {
    case 'circle':
      return (
        <div
          className={clsx(skeletonBaseStyles, className, 'rounded-full')}
          style={{
            width: props.size,
            height: props.size,
          }}
        />
      );
    case 'rectangle':
      return (
        <div
          className={clsx(skeletonBaseStyles, className, 'rounded-[16px]')}
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      );
    case 'text':
      return (
        <span
          className={clsx(skeletonBaseStyles, className, 'rounded-md w-full inline-block')}
          style={{ height: props.fontSize ?? '1em' }}
        />
      );
  }
};

export default Skeleton;
