'use client';

import React, { useEffect } from 'react';
import NotificationsList from './NotificationsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../UI/Tabs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearMessages, removeByMessageUid, removeByUid } from '@/store/slices/websocketSlice';
import { websocketService } from '@/utilts/websocket/websocket';

const NotificationsTabs = () => {
  const subscribers = useSelector((state: RootState) => state.websocket.subscribers);

  const dispatch = useDispatch();

  const handleRemoveSubscriber = (uid: string) => {
    dispatch(removeByUid(uid));
  };

  const handleReadNotification = (uuid: string) => {
    websocketService.sendMessage(JSON.stringify([uuid]));
    dispatch(removeByMessageUid(uuid));
  };

  useEffect(() => {
    dispatch(clearMessages());
  }, []);

  return (
    <Tabs defaultValue='all' className='w-full'>
      <TabsList className='flex border-b border-onyxGrey space-x-4'>
        <TabsTrigger
          value='all'
          className='text-[17px] font-semibold px-4 py-1 border-b-4 border-transparent text-gray-500'
        >
          All
        </TabsTrigger>
        <TabsTrigger
          value='comments'
          className='text-[17px] font-semibold px-4 py-1 border-b-4 border-transparent text-gray-500'
        >
          Comments
        </TabsTrigger>
        <TabsTrigger
          value='mentions'
          className='text-[17px] font-semibold px-4 py-1 border-b-4 border-transparent text-gray-500'
        >
          Mentions
        </TabsTrigger>
        <TabsTrigger
          value='subscriptions'
          className='text-[17px] font-semibold px-4 py-1 border-b-4 border-transparent text-gray-500'
        >
          Subscriptions
        </TabsTrigger>
        <TabsTrigger
          value='ratings'
          className='text-[17px] font-semibold px-4 py-1 border-b-4 border-transparent text-gray-500'
        >
          Reactions
        </TabsTrigger>
      </TabsList>
      <TabsContent value='all'>
        <NotificationsList
          NotificationsList={subscribers}
          onRead={handleReadNotification}
          onRemove={handleRemoveSubscriber}
        />
      </TabsContent>
      <TabsContent value='comments'>
        <NotificationsList NotificationsList={[]} />
      </TabsContent>
      <TabsContent value='mentions'>
        <NotificationsList NotificationsList={[]} />
      </TabsContent>
      <TabsContent value='subscriptions'>
        <NotificationsList NotificationsList={[]} />
      </TabsContent>
      <TabsContent value='subscribers'>
        <NotificationsList NotificationsList={subscribers} />
      </TabsContent>
      <TabsContent value='ratings'>
        <NotificationsList NotificationsList={[]} />
      </TabsContent>
    </Tabs>
  );
};

export default NotificationsTabs;
