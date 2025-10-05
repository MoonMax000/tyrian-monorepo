'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import IconBell from '@/assets/icons/icon-bell.svg';
import IconPeolpe from '@/assets/icons/subscriptions/icon-peolpe.svg';
import IconDocs from '@/assets/icons/subscriptions/icon-docs.svg';
import IconClouds from '@/assets/icons/subscriptions/icon-clouds.svg';
import Online from '../UI/Online/Online';
import { useGetFollowersQuery, useGetUserFollowersQuery } from '@/store/api';
import DefUserPhoto from '@/assets/def-logo.png';
import SubscribeButton from '../SubscribeButton/SubscribeButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface Props {
  userId?: string;
}

const FollowersList: React.FC<Props> = ({ userId }) => {
  const ownId = useSelector((state: RootState) => state.user.id);

  const {
    data: followersData,
    isLoading: isFollowersLoading,
    error: isFollowersError,
    refetch,
  } =
    userId === ownId || !userId
      ? useGetFollowersQuery()
      : useGetUserFollowersQuery(userId);

  useEffect(() => {
    refetch();
  }, [])

  return (
    <div className='flex flex-col m-auto gap-6'>
      {isFollowersLoading ? (
        <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin m-auto mt-6' />
      ) : isFollowersError ? (
        <h3 className='font-bold text-2xl gap-1 m-auto mt-6'>No data</h3>
      ) : followersData?.data && followersData.data.length ? (
        followersData.data.map((user, index) => {
          return (
            <div
              key={index}
              className='bg-[#181A20] rounded-[15px] w-[712px] p-4 flex items-center'
            >
              <div className='relative w-11 h-11 mr-4'>
                <Image
                  src={!!user.avatar_url ? user.avatar_url : DefUserPhoto.src}
                  alt='photo'
                  className='w-11 h-11 rounded-full'
                  width={44}
                  height={44}
                />
              </div>
              <div className='flex w-full items-center justify-between text-[12px] h-11'>
                <div className='flex flex-col'>
                  <div className='flex gap-2 items-center'>
                    <span className='text-white'>{user.username}</span>
                  </div>
                  <span className='text-white'>
                    <Online isOnline={true} />
                  </span>
                </div>
                <div className='flex gap-6 items-center'>
                  <div className='opacity-50 flex gap-1'>
                    <IconPeolpe />
                    <span>{user.follower_count || 0}</span>
                  </div>
                  <div className='opacity-50 flex gap-1'>
                    <IconDocs />
                    <span>1 000 000</span>
                  </div>
                  <div className='flex gap-4'>
                    <div className='p-[10px] bg-[#FFFFFF14] rounded-lg'>
                      <IconClouds />
                    </div>
                    <SubscribeButton userId={user.id} />
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='flex flex-col m-auto gap-6 mt-6 items-center opacity-50'>
          <IconBell className='w-10 h-10' />
          <span></span>
        </div>
      )}
    </div>
  );
};

export default FollowersList;
