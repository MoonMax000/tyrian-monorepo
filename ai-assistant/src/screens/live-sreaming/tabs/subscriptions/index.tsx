'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from '@/components/ui/Header/Search';
import SearchIcon from '@/assets/search.svg';
import MockTableDonate from '@/assets/mock-table.svg';
import SubscribeButtom from './SubscribeButton';
import { RecomendationService } from '@/services/RecomendationService';
import userAvatar from '@/assets/mock-avatars/userAvatar.png';
import TabSwitchButton from '@/components/ui/TabSwitchButton';

export const Subscriptions = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const section =
    (searchParams.get('section') as 'mySubscribers' | 'subscribedTo') ||
    'mySubscribers';

  const handleSectionChange = (value: 'mySubscribers' | 'subscribedTo') => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('section', value);
    router.push(`?${newParams.toString()}`);
  };

  const { data: listData, isLoading } = useQuery({
    queryKey: ['subscriptions', section],
    queryFn: () =>
      section === 'mySubscribers'
        ? RecomendationService.getSubscribers({
            page: 1,
            page_size: 20,
            sort_by: 'username',
            sort_dir: 'asc',
          })
        : RecomendationService.getSubscriptions(),
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex p-[1px] gap-[1px] w-fit border border-regaliaPurple rounded-[8px] bg-[#0C101480] backdrop-blur-[100px]'>
        <TabSwitchButton
          active={section === 'mySubscribers'}
          onClick={() => handleSectionChange('mySubscribers')}
        >
          My subscribers
        </TabSwitchButton>
        <TabSwitchButton
          active={section === 'subscribedTo'}
          onClick={() => handleSectionChange('subscribedTo')}
        >
          Subscribed to
        </TabSwitchButton>
      </div>

      <div className='flex flex-col gap-6 p-6 container-card'>
        <Search
          wrapperClassName='min-w-[540px]'
          placeholder='Search'
          icon={<SearchIcon />}
          iconPosition='left'
        />

        {isLoading && <div>Loading...</div>}

        <ul>
          {listData?.data?.map((el) => {
            const { avatar_url, subscriber_count, username, id, stream } = el;
            const isOnline = stream?.is_online || false;

            const isSubscribed =
              section === 'mySubscribers' ? el.is_subscribed : el.subscribed;

            return (
              <li
                className='grid grid-cols-[25%,15%,15%,auto] pb-4 mt-4 border-b border-onyxGrey'
                key={id}
              >
                <div className='flex items-center'>
                  <img
                    src={avatar_url || userAvatar.src}
                    className='mr-2 w-11 h-11 rounded-full'
                    alt='avatar'
                  />
                  <span className='text-[15px] font-bold'>{username}</span>
                </div>

                {!isOnline ? (
                  <div className='flex items-center opacity-[40%] gap-[6px] w-full justify-start'>
                    <div className='h-3 w-3 bg-white rounded-full'></div>
                    <span className='text-[13px] min-w-[73px]'> Offline</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-[6px] w-full justify-start'>
                    <div className='h-3 w-3 bg-green rounded-full'></div>
                    <span className='text-[13px] text-green'> Online</span>
                  </div>
                )}

                <div className='flex items-center'>
                  <p className='text-[13px] font-bold'>{subscriber_count}</p>
                </div>

                <div className='flex justify-end'>
                  <SubscribeButtom
                    id={id}
                    type={isSubscribed ? 'unsubscribe' : 'subscribe'}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      {section === 'subscribedTo' && <MockTableDonate />}
    </div>
  );
};
