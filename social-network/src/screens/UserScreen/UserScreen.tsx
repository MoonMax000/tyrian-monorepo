'use client';

import Post from '@/components/Post';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import IconNoContent from '@/assets/icons/icon-no-content.svg';
import React from 'react';
import { useEffect } from 'react';
import UserPanel from '@/components/UserPanel';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';
import FollowersList from '@/components/Followers/FollowersList';
import SubscriptionsList from '@/components/Subscriptions/SubscriptionsList';
import { isPost, isPostType, useLazyGetUserPostsQuery } from '@/store/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import LikesScreen from '../LikesScreen';
import { useGetFavoritePostsQuery } from '@/store/postsApi';
import { useParams } from 'next/navigation';

const tabsTriggers = [
  {
    name: 'Ideas',
    value: 'ideas',
  },
  {
    name: 'Opinions',
    value: 'opinions',
  },
  {
    name: 'Scripts',
    value: 'scripts',
  },
  {
    name: 'Videos',
    value: 'videos',
  },
  {
    name: 'Following',
    value: 'subscriptions',
  },
  {
    name: 'Followers',
    value: 'subscribers',
  },
  {
    name: 'Liked',
    value: 'liked',
  },
];

const UserScreen = () => {
  const params = useParams<{ id: string | string[] }>();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const ownId = useSelector((state: RootState) => state.user.id);
  const isOwn: boolean = userId === ownId;

  const { data: favoritePostsData } = useGetFavoritePostsQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const favoritePostIds = favoritePostsData?.data.map((post) => post.id) || [];
  const getPostsByType = (type: string) => {
    if (!userPostsData?.data) return [];

    return userPostsData.data
      .filter((post) => {
        if (isPost(post)) return post.type === type;
      })
      .map((post) => {
        if (isPost(post))
          return (
            <Post
              isBlur={post.need_payment}
              liked={post.liked}
              likeCount={post.like_count}
              key={post.id}
              userId={post.user_id}
              postId={post.id}
              title={post.title}
              message={post.content}
              typeTag={isPostType(post.type) ? post.type : 'ideas'}
              user_name={post.user_name}
              bgImg={post.files?.[0]?.url || post.media_url || undefined}
              isFavorite={favoritePostIds.includes(post.id)}
              tags={post.tags?.map((tag) => tag.name) || []}
              created={post.created}
              videoSrc={post.files?.[0]?.url || post.media_url || undefined}
              fileType={post.files?.[0]?.type}
            />
          );
      });
  };

  const [triggerUserPostsQuery, { data: userPostsData }] = useLazyGetUserPostsQuery();

  useEffect(() => {
    if (userId) {
      triggerUserPostsQuery({
        userId,
        page: 1,
        page_size: 10,
        sort_type: 'normal',
      });
    }
  }, [userId, triggerUserPostsQuery]);

  const tabsContent = [
    {
      value: 'ideas',
      content: getPostsByType('ideas'),
    },
    {
      value: 'opinions',
      content: [],
    },
    {
      value: 'scripts',
      content: getPostsByType('script'),
    },
    {
      value: 'videos',
      content: getPostsByType('video'),
    },
    {
      value: 'subscriptions',
      content: [<SubscriptionsList key='subscriptions' userId={userId} />],
    },
    {
      value: 'subscribers',
      content: [<FollowersList key='followers' userId={userId} />],
    },
    {
      value: 'liked',
      content: [<LikesScreen key='liked' />],
    },
  ];

  return (
    <div className='flex justify-between gap-6'>
      <Tabs defaultValue='ideas' className='w-[712px]'>
        <TabsList className='flex border-b border-onyxGrey space-x-4 justify-between'>
          <div className='flex items-center justify-start gap-2'>
            {tabsTriggers.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className='text-[17px] font-semibold px-0 py-1.5 border-b-4 border-transparent text-gray-500'
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </div>
        </TabsList>
        {tabsContent.map((tab) => (
          <TabsContent key={tab?.value} value={tab?.value} className='flex flex-col gap-6 mt-6'>
            {tab.content.length ? (
              tab.content
            ) : (
              <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
                <IconNoContent className='w-10 h-10' />
                <span>Nothing new yet...</span>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      <div className='flex flex-col gap-8 w-[344px]'>
        {userId && <UserPanel userId={userId} isOwn={isOwn} />}
        <RecommendedList RecommendedList={recommendedData} />
      </div>
    </div>
  );
};

export default UserScreen;
