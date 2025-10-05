'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { FC, Suspense } from 'react';
import { StreamingProfileWrapper } from './tabs/profile/StreamingProfileWrapper';
import ContentWrapper from '@/components/ui/ContentWrapper/ContentWrapper';
import { StreamingNotifications } from './tabs/notification';
import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/UserService';
import { Subscriptions } from './tabs/subscriptions';
import { useRouter, useSearchParams } from 'next/navigation';

export const LiveStreamingScreen: FC = () => {
  const { data: userData } = useQuery({
    queryKey: ['getProfileStreaming'],
    queryFn: () => UserService.getProfile(),
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'profile';

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('tab', value);

    if (value !== 'subscriptions') {
      newParams.delete('section');
    }

    router.push(`?${newParams.toString()}`);
  };
  return (
    <ContentWrapper>
      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={handleTabChange}
      >
        <TabsList className='flex border-b-0 justify-start items-center mb-4'>
          <TabsTrigger
            value='profile'
            className='text-[19px] text-lighterAluminum font-semibold py-1 border-b-4 border-transparent !px-0'
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value='notifications'
            className='text-[19px] text-lighterAluminum font-semibold py-1 border-b-4 border-transparent !px-0'
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value='subscriptions'
            className='text-[19px] text-lighterAluminum font-semibold py-1 border-b-4 border-transparent !px-0'
          >
            Subscriptions
          </TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          {userData && <StreamingProfileWrapper userData={userData} />}
        </TabsContent>
        <TabsContent value='notifications'>
          {userData && (
            <StreamingNotifications
              isStreamer={userData?.roles?.indexOf('streamer') !== -1}
            />
          )}
        </TabsContent>
        <TabsContent value='subscriptions'>
          <Suspense>
            <Subscriptions />
          </Suspense>
        </TabsContent>
      </Tabs>
    </ContentWrapper>
  );
};
