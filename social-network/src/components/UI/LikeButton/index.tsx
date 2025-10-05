'use client';

import FilledHeart from '@/assets/icons/hearts/filledHeart.svg';
import EmptyHeart from '@/assets/icons/hearts/emptyHeart.svg';
import clsx from 'clsx';
import { FC, useState } from 'react';
import { formatNumber } from '@/utilts/formatNumber';

interface LikeButtonProps {
  likeCount?: number;
  isLiked?: boolean;
  onLike?: () => void;
  onUnlike?: () => void;
}

const LikeButton: FC<LikeButtonProps> = ({ likeCount = 0, isLiked = false, onLike, onUnlike }) => {
  const [isLikedState, setIsLikedState] = useState<boolean>(isLiked);
  const [likesCount, setLikesCount] = useState<number>(likeCount);

  const toggleLike = () => {
    if (isLikedState) {
      setIsLikedState(false);
      setLikesCount((prev) => prev - 1);
      onUnlike?.();
    } else {
      setIsLikedState(true);
      setLikesCount((prev) => prev + 1);
      onLike?.();
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-[6px] cursor-pointer transition-colors duration-200',
        isLikedState ? 'text-purple' : 'text-webGray',
      )}
      onClick={toggleLike}
    >
      <div
        className={clsx('transition-transform duration-200', {
          'animate-like': isLikedState,
          'animate-unlike': !isLikedState,
        })}
      >
        {isLikedState ? <FilledHeart /> : <EmptyHeart />}
      </div>
      <span className='text-[13px] font-bold'>{formatNumber(likesCount)}</span>
    </div>
  );
};

export default LikeButton;
