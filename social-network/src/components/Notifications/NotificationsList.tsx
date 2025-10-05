'use client';

import React from 'react';
import { SubscriberItem } from './constatnts';
import NotificationItem from './NotificationItem';
import IconBell from '@/assets/icons/icon-bell.svg';

interface NotificationsListProps {
  NotificationsList: SubscriberItem[];
  onRemove?: (uid: string) => void;
  onRead?: (uuid: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  NotificationsList,
  onRemove,
  onRead,
}) => {
  return (
    <div className='flex flex-col m-auto gap-2 mt-6'>
      {NotificationsList.length ? (
        NotificationsList.map((notification, index) => {
          if (notification.status && notification.status === 'unread') {
            return (
              <NotificationItem
                key={notification.uid ? notification.uid + index.toString() : index}
                notification={notification}
                onRemove={onRemove}
                onRead={onRead}
              />
            );
          }
        })
      ) : (
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
          <IconBell className='w-10 h-10' />
          <span>Nothing new yet</span>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
