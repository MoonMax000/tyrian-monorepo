import React from 'react';
import Image from 'next/image';
import { AvatarProps } from '@/components/Avatar/types';
import clsx from 'clsx';

const Avatar = ({ src, alt, size = 'md', className }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-20 h-20',
    lg: 'w-40 h-40',
  };

  if (src === undefined) {
    return (
      <div
        className={clsx(
          'border-4 border-purple border-t-transparent rounded-full animate-spin',
          sizeClasses[size],
        )}
      ></div>
    );
  }

  return (
    <div className={clsx('rounded-full overflow-hidden', sizeClasses[size], className)}>
      <Image
        unoptimized
        src={src !== '' ? src : '/avatar.jpeg'}
        alt={alt}
        width={size === 'sm' ? 44 : size === 'md' ? 80 : 160}
        height={size === 'sm' ? 44 : size === 'md' ? 80 : 160}
        className='object-cover w-full h-full'
      />
    </div>
  );
};

export default Avatar;
