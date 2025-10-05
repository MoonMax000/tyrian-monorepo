'use client';

import IconFollow from '@/assets/button/icon-follow.svg';
import IconUnFollow from '@/assets/button/icon-unfollow.svg';
import AddIcon from '@/assets/system-icons/addIcon.svg';
import FollowingIcon from '@/assets/system-icons/FollowingIcon.svg';

import { cn } from '@/utilts/cn';
import { FC, useState } from 'react';
import ButtonWrapper from '../ButtonWrapper/ButtonWrapper';
import Button from '../Button/Button';

export interface SubscribeButtonProps {
  userId?: string;
  onClick?: () => void;
  type?: 'icon' | 'text' | 'iconWithText';
  isSubscribed?: boolean;
  className?: string;
}

const SubscribeButton: FC<SubscribeButtonProps> = ({
  className,
  onClick,
  type = 'text',
  isSubscribed = false,
}) => {
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed);

  const toggleSubscribed = () => {
    setSubscribed((prev) => !prev);
    onClick?.();
  };

  if (type === 'icon') {
    return (
      <div onClick={toggleSubscribed} className={className}>
        {subscribed ? <IconUnFollow /> : <IconFollow />}
      </div>
    );
  }

  if (type === 'iconWithText') {
    return subscribed ? (
      <Button
        className={cn('flex items-center gap-[8px] text-white', className)}
        onClick={toggleSubscribed}
      >
        <FollowingIcon width={20} height={20} />
        Following
      </Button>
    ) : (
      <ButtonWrapper
        className={cn('flex items-center justify-center rounded-[8px] gap-[8px] group', className)}
        onClick={toggleSubscribed}
      >
        <AddIcon width={20} height={20} className='text-lighterAluminum group-hover:text-white' />
        <div className='text-white'>Follow</div>
      </ButtonWrapper>
    );
  }

  return (
    <Button
      variant={subscribed ? 'danger' : 'primary'}
      ghost={subscribed}
      className={cn('text-xs', className)}
      onClick={toggleSubscribed}
    >
      {subscribed ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default SubscribeButton;
