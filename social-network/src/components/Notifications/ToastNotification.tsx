'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import NotificationItem from '@/components/Notifications/NotificationItem';
import { useToast } from '../UI/ToastPortal/ToastPortal';
import { socialWebApi, UserResponse } from '@/store/socialWebApi';
import store from '@/store/store';
import { timeAgo } from '@/helpers/timeAgo';
import { selectAllChatMessages } from '@/store/selectors/chatWebsocketSelectors';
import { updateSubscriberPhoto } from '@/store/slices/websocketSlice';

const ToastNotification = () => {
  const showToast = useToast();
  const subscribers = useSelector((state: RootState) => state.websocket.subscribers);

  const [lastIndex, setLastIndex] = useState(0);
  const lastShownMessageIdRef = useRef<string | null>(null);

  const messages = useSelector(selectAllChatMessages);
  const userId = useSelector((state: RootState) => state.user.id);

  useEffect(() => {
    if (!userId || subscribers.length === 0 || lastIndex >= subscribers.length) return;

    const interval = setInterval(() => {
      const notification = subscribers[0];
      if (!notification?.uid) return;
      store.dispatch(socialWebApi.endpoints.getUserById.initiate(notification.uid)).then((res) => {
        const userData = (res as { data?: UserResponse }).data;
        const avatar = userData?.avatar_url || '/def-logo.png';

        if (notification.uid) {
          store.dispatch(updateSubscriberPhoto({ uid: notification.uid, photo: avatar }));
        }

        showToast(
          <NotificationItem
            className='w-[494px]'
            notification={{
              ...notification,
              photo: avatar,
            }}
          />,
        );
      });

      setLastIndex((prev) => prev + 1);
    }, 300);

    return () => clearInterval(interval);
  }, [userId, subscribers, lastIndex, showToast]);

  useEffect(() => {
    const lastMsg = messages.at(-1);

    if (
      lastMsg?.type === 'MSG' &&
      lastMsg.data?.sender !== userId &&
      lastMsg.data?.id !== lastShownMessageIdRef.current
    ) {
      lastShownMessageIdRef.current = lastMsg.data.id;

      const senderId = lastMsg.data.sender;

      store.dispatch(socialWebApi.endpoints.getUserById.initiate(senderId)).then((res) => {
        const userData = (res as { data?: UserResponse }).data;
        const avatar = userData?.avatar_url || '/def-logo.png';

        if (lastMsg?.data?.id) {
          store.dispatch(updateSubscriberPhoto({ uid: lastMsg.data.id, photo: avatar }));
        }

        showToast(
          <NotificationItem
            className='w-[494px]'
            notification={{
              uid: lastMsg.data.id,
              name: lastMsg.data.nick,
              photo: avatar,
              date: timeAgo(lastMsg.data.timestamp),
              text: lastMsg.data.data,
              textLink: `/chats/message/${lastMsg.data.sender}`,
              type: 'text',
            }}
          />,
        );
      });
    }
  }, [messages, userId, showToast]);

  return null;
};

export default ToastNotification;
