'use client';

import { FC } from 'react';
import Image from 'next/image';
import IconText from '@/assets/icons/icon-text.svg';
import IconFile from '@/assets/icons/icon-file.svg';
import IconLike from '@/assets/icons/icon-like.svg';
import IconPerson from '@/assets/icons/icon-person.svg';
import IconLink from '@/assets/icons/icon-link.svg';
import { SubscriberItem } from './constatnts';
import Link from 'next/link';
import { useGetUserByEmailQuery } from '@/store/authApi';
import { getMediaUrl } from '@/helpers/getMediaUrl';

interface NotificationItemProps {
  notification: SubscriberItem;
  onRemove?: (uid: string) => void;
  className?: string;
  onRead?: (uuid: string) => void;
}

const iconMap: Record<string, FC<{ className?: string }>> = {
  text: IconText,
  subscribe_post: IconFile,
  person: IconPerson,
  like_post: IconLike,
  link: IconLink,
};

const NotificationItem: FC<NotificationItemProps> = ({ notification, className, onRead }) => {
  const { data: userData } = useGetUserByEmailQuery(notification?.email ?? '');

  const IconComponent = iconMap[notification.type];

  return (
    <div
      className={`bg-[#0C101480] backdrop-blur-[100px] hover:bg-regaliaPurple cursor-pointer rounded-[8px] border border-regaliaPurple p-[12px_24px_12px_16px] flex items-center ${
        className || ''
      }`}
      onClick={() => {
        onRead?.(notification?.id ?? '');
      }}
    >
      <div className='relative w-10 h-10 mr-4'>
        <Image
          src={getMediaUrl(userData?.avatar ?? '') ?? '/mock-avatar-header.jpg'}
          alt='photo'
          className='w-10 h-10 rounded-full'
          unoptimized
          width={44}
          height={44}
        />
        {IconComponent && <IconComponent className='absolute w-5 h-5 bottom-[-6px] right-[-4px]' />}
      </div>
      <div className='flex flex-col flex-1'>
        <div className='flex gap-2 items-center'>
          <span className='text-primary'>{userData?.username ?? notification.name}</span>
          <span className='text-[#898989] text-sm'>{notification.date}</span>
        </div>
        <span className='text-white line-clamp-[3] break-all overflow-hidden'>
          {notification.text}{' '}
          {notification.textLink && (
            <Link href={notification.textLink} className='text-primary underline'>
              {notification.textLink}
            </Link>
          )}
        </span>
      </div>
      {/* <button
        onClick={() => onRemove?.(notification.uid)}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        ❌ Удалить
      </button> */}
    </div>
  );
};

export default NotificationItem;
