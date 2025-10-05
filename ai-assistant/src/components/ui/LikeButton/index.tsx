'use client';

import IconLike from '@/assets/post/like.svg';
import IconLiked from '@/assets/post/liked.svg';
import { cn } from '@/utilts/cn';

import { FC, useState } from 'react';

interface LikeButtonProps {
  likeCount?: number;
  isLiked?: string;
}

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1).replace('.0', '')}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1).replace('.0', '')}K`;
  }
  return num.toString();
};

const LikeButton: FC<LikeButtonProps> = ({ likeCount = 1500, isLiked = '' }) => {
  const [liked, setLiked] = useState<boolean>(!!isLiked);
  const [likes, setLikes] = useState<number>(likeCount);

  const handleClick = () => {
    const wasLiked = liked;
    setLiked(!liked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
  };

  return (
    <div
      className={cn('flex items-center gap-[6px] cursor-pointer', {
        'text-webGray': !liked,
        'text-purple': liked,
      })}
      onClick={handleClick}
    >
      <div
        className={cn('transition-transform duration-200', {
          'animate-like': liked,
          'animate-unlike': !liked,
        })}
      >
        {liked ? <IconLiked /> : <IconLike />}
      </div>
      <span className='text-[13px] font-bold'>{formatNumber(likes)}</span>
      <style jsx>{`
        @keyframes like {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes unlike {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.8);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-like {
          animation: like 0.2s ease-in-out;
        }
        .animate-unlike {
          animation: unlike 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default LikeButton;
