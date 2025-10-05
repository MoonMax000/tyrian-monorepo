import Paper from '@/components/ui/Paper/Paper';
import NotificationItem from './NotificationItem';
import { FC } from 'react';
import { StreamerPermission } from '../../componets/StreamerPermission';

export interface ProfileNotificationModel {
  name: string;
  description: string;
  key: string;
}

const notifications: ProfileNotificationModel[] = [
  {
    name: 'Stream Going Live',
    description: 'When a followed channel starts a live stream',
    key: 'start_broadcast',
  },
  {
    name: 'Replay of Past Streams (VODs)',
    description: 'When a followed channel starts a replay',
    key: 'last_broadcasts',
  },
  {
    name: 'Mentions in Chat',
    description: 'When someone mentions you in the chat',
    key: 'references',
  },
  {
    name: 'New Follower',
    description: 'When another user follows you',
    key: 'new_subscriber',
  },
  {
    name: 'Recommednded Streams',
    description: 'When streams that match your interests go live',
    key: 'broadcast',
  },
  {
    name: 'Subscriptions',
    description: 'When there’s news about channels you’re subscribed to',
    key: 'subscriptions',
  },
];

interface Props {
  isStreamer: boolean;
}

export const StreamingNotifications: FC<Props> = (isStreamer) => {
  return (
    <div className='flex flex-col gap-12'>
      {!isStreamer && <StreamerPermission />}
      <div>
        <div className='relative w-full h-fit'>
          <Paper className=' !p-0 max-tablet:!bg-transparent max-tablet:flex max-tablet:flex-col max-tablet:gap-8'>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.key}
                notification={notification}
              />
            ))}
          </Paper>
          {!isStreamer && (
            <div className='left-0 top-0 absolute w-full h-full bg-white opacity-5 rounded-3xl' />
          )}
        </div>
      </div>
    </div>
  );
};
