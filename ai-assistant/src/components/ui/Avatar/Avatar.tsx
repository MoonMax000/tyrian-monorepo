import { cn } from '@/utilts/cn';
import Image, { StaticImageData } from 'next/image';
import { useState } from 'react';

type AvatarSize = 'large' | 'small';

interface AvatarProps {
  src?: string | StaticImageData;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeConfig = {
  large: {
    size: 160,
    radius: 'rounded-[16px]',
    text: 'text-2xl',
  },
  small: {
    size: 44,
    radius: 'rounded-[50px]',
    text: 'text-base',
  },
};

export default function Avatar({
  src,
  alt = 'User avatar',
  fallback,
  size = 'small',
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const { size: px, radius, text } = sizeConfig[size];

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center box-contentshadow-avatar-shadow overflow-hidden box-border',
        className,
        radius,
        { 'border-[3px] border-solid border-regaliaPurple': size === 'large' },
      )}
      style={{
        width: px,
        height: px,
      }}
    >
      {!imgError && src ? (
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className='w-full h-full object-cover'
          onError={() => setImgError(true)}
        />
      ) : fallback ? (
        <span className={`font-bold text-purple-800 select-none ${text}`}>{fallback}</span>
      ) : (
        <Image
          src={'/images/avatar_default.jpg'}
          alt={alt}
          width={px}
          height={px}
          className='w-full h-full object-cover'
          onError={() => setImgError(true)}
        />
      )}
    </div>
  );
}