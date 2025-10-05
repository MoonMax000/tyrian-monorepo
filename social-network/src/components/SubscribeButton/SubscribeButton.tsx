'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSubscribeToUserMutation, useUnsubscribeFromUserMutation } from '@/store/socialWebApi';
import { RootState } from '@/store/store';
import { subscribe, unsubscribe } from '@/store/slices/subscriptionSlice';
import { useAuthorizationModal } from '@/context/AuthorizationModalContext';
import { useGetFollowingQuery } from '@/store/api';
import { Button } from '../UI/Button';
import IconFollow from '@/assets/icons/button/icon-follow.svg';
import IconUnFollow from '@/assets/icons/button/icon-unfollow.svg';
import clsx from 'clsx';
import { useAppSelector } from '@/store/hooks';
import Loader from '@/components/UI/Loader';

export interface SubscribeButtonProps {
  userId: string;
  onClick?: () => void;
  type?: 'icon' | 'text';
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ userId, onClick, type = 'icon' }) => {
  const dispatch = useDispatch();
  const subscribedUserIds = useSelector((state: RootState) => state.subscription.subscribedUserIds);
  const isSubscribed = subscribedUserIds.includes(userId);

  const { setAuthorizationModalType } = useAuthorizationModal();
  const isAuthenticated = Boolean(useAppSelector((state) => state.user.id));

  const [subscribeToUser] = useSubscribeToUserMutation();
  const [unsubscribeFromUser] = useUnsubscribeFromUserMutation();
  const { data: followingData, isLoading: isFollowingLoading } = useGetFollowingQuery();

  useEffect(() => {
    if (Array.isArray(followingData?.data)) {
      const userSubscribed = followingData.data.some((user) => user.id === userId);

      if (userSubscribed) {
        dispatch(subscribe(userId));
      } else {
        dispatch(unsubscribe(userId));
      }
    }
  }, [followingData, dispatch, userId]);

  const handleClick = async () => {
    if (!isAuthenticated) {
      setAuthorizationModalType('login');
      return;
    }
    try {
      if (isSubscribed) {
        await unsubscribeFromUser({ user_id: userId }).unwrap();
        console.log('✅ Отписались от', userId);
        dispatch(unsubscribe(userId));
      } else {
        await subscribeToUser({ user_id: userId }).unwrap();
        console.log('✅ Подписались на', userId);
        dispatch(subscribe(userId));
      }
      if (onClick) onClick();
    } catch (error: any) {
      console.log(error);
      if (error?.status === 400) {
        const errorMessage = error?.data?.message || 'Ошибка 400';
        if (errorMessage === 'Already subscribed to this user') {
          console.warn('⚠️ Уже подписаны, обновляем состояние');
          dispatch(subscribe(userId));
        } else if (errorMessage === 'Not subscribed to this user') {
          console.warn('⚠️ Уже отписаны, обновляем состояние');
          dispatch(unsubscribe(userId));
        }
      }
    }
  };

  return (
    <div onClick={() => handleClick()}>
      {type === 'text' ? (
        <Button
          className={clsx(
            '!p-[6px] max-h-[32px] max-w-[80px] !text-[12px]',
            isSubscribed
              ? 'bg-transparent border border-regaliaPurple'
              : 'bg-[linear-gradient(270deg,#A06AFF_0%,#482090_100%)]',
          )}
        >
          {isFollowingLoading ? <Loader /> : isSubscribed ? 'Unfollow' : 'Follow'}
        </Button>
      ) : isSubscribed ? (
        <IconUnFollow />
      ) : (
        <IconFollow />
      )}
    </div>
  );
};

export default SubscribeButton;
