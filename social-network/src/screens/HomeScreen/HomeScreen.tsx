'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Pagination from '@/components/UI/Pagination';
import Post from '@/components/Post';
import { useGetPostsQuery, useGetFavoritePostsQuery } from '@/store/postsApi';
import IconPopular from '@/assets/icons/nav/popular.svg';
import IconTime from '@/assets/icons/time.svg';
import {
  isPost,
  isPostType,
  TPostType,
  TSortPost,
  useGetPostSearchMutation,
  useGetUsersSearchMutation,
} from '@/store/api';
import NothingNew from '@/components/NothingNew';
import { cn } from '@/utilts/cn';
import SearchElement from '@/components/UI/Search/SearchUserElement';
import Image from '@/components/UI/Image';
import { ButtonsPanel, HomeTab } from '@/components/ButtonsPanel';
import IconDown from '@/assets/icons/navbar/ArrowButton.svg';
import Select from '@/components/UI/Select';
import VideoIcon from '@/assets/icons/navbar/LiveStreaming.svg';
import { Button } from '@/components/UI/Button';
import ModalWrapper from '@/components/UI/ModalWrapper';
import PostEditor from '@/components/CreatePost';

const HomeScreen = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { searchString, searchCategory } = useAppSelector((state) => state.search);
  const q = React.useMemo(() => (searchString ?? '').trim(), [searchString]);
  const searchKind: 'posts' | 'tags' | 'users' = React.useMemo(() => {
    const v = (searchCategory as string) || '';
    if (v === 'users' || v === 'tags') return v;
    return 'posts';
  }, [searchCategory]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);

  const [sortFilter, setSortFilter] = useState<TSortPost>('created');

  const me = useAppSelector((state) => state.user);
  const [category, setCategory] = useState<TPostType | ''>('');
  const [activeTab, setActiveTab] = useState<HomeTab>('Popular');

  const [currentPage, setCurrentPage] = useState(1);

  const [lastQS, setLastQS] = useState<string>('');

  useEffect(() => {
    if (!hydratedFromUrl) return;
    const sort_type = sortFilter === 'popular' ? 'recommended' : 'latest';

    const qs = new URLSearchParams();

    qs.set('tab', activeTab);

    if (category) qs.set('type', category);

    qs.set('sort', sort_type);

    if (q) {
      qs.set('q', q);
      qs.set('search', searchKind);
    }

    qs.set('page', String(currentPage));

    const next = `${pathname}?${qs.toString()}`;
    if (next !== lastQS) {
      setLastQS(next);
      router.replace(next, { scroll: false });
    }
  }, [
    activeTab,
    category,
    sortFilter,
    q,
    searchKind,
    currentPage,
    pathname,
    router,
    lastQS,
    hydratedFromUrl,
  ]);

  useEffect(() => {
    const tabParam = (searchParams.get('tab') || 'Popular') as HomeTab;
    const typeParam = searchParams.get('type') || '';
    const sortParam = searchParams.get('sort') || 'latest';
    const pageParam = Number(searchParams.get('page') || '1');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
    const nextType = isPostType(typeParam) ? (typeParam as TPostType) : '';
    if (nextType !== category) {
      setCategory(nextType);
    }
    const nextSort: TSortPost = sortParam === 'recommended' ? 'popular' : 'created';
    if (nextSort !== sortFilter) {
      setSortFilter(nextSort);
    }
    const nextPage = !Number.isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
    }
    setHydratedFromUrl(true);
  }, [searchParams]);

  const resultSearchString = (
    <span>
      Search result for <span className='text-foreground'>&quot;{searchString}&quot;</span>
    </span>
  );

  const [
    searchMutation,
    { data: searchResponse, isLoading: isSearchLoading, isError: isSearchError },
  ] = useGetPostSearchMutation();
  const [searchUserMutation, { data: searchUsersResponse, isLoading: isUsersLoading }] =
    useGetUsersSearchMutation();

  const isPostSearch = searchKind !== 'users';

  const options = [
    { label: 'All Posts', value: '' },
    { label: 'Ideas', value: 'ideas' },
    { label: 'Opinions', value: 'opinions' },
    { label: 'Analytics', value: 'analytics' },
    { label: 'Softwares', value: 'softwares' },
  ];

  const handleTypeChange = (val: string | undefined) => {
    const next = isPostType(val) ? (val as TPostType) : '';
    setCategory(next);
    setCurrentPage(1);
    if (activeTab !== 'Popular') setActiveTab('Popular');
  };

  const handleSortChange = (sort: TSortPost) => {
    setSortFilter(sort);
    setCurrentPage(1);
  };

  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };

  useEffect(() => {
    if (!q) return;

    if (searchKind !== 'posts') {
      if (category !== '') setCategory('');
      return;
    }

    const raw = (searchCategory as string) || '';

    const toType = (v: string): TPostType | '' =>
      v === 'softs' ? 'softwares' : isPostType(v) ? (v as TPostType) : '';

    const next = toType(raw);
    if (next !== category) setCategory(next);
  }, [q, searchKind, searchCategory, category]);

  useEffect(() => {
    if (!q) return;

    if (searchKind === 'users') {
      searchUserMutation({ q, page: currentPage, page_size: 5 });
      return;
    }

    const params: any = {
      userId: me.id || '',
      page: currentPage,
      page_size: 5,
      sort: sortFilter,
      ...(category && { type: category }),
    };

    if (searchKind === 'tags') {
      params.tags = q;
    } else {
      params.q = q;
    }

    searchMutation(params);
  }, [q, searchKind, currentPage, sortFilter, me.id, searchMutation, searchUserMutation, category]);

  const sortType = React.useMemo<'latest' | 'recommended'>(
    () => (sortFilter === 'popular' ? 'recommended' : 'latest'),
    [sortFilter],
  );

  const postsArgs = React.useMemo(() => {
    const base = { page: currentPage, page_size: 10, sort_type: sortType } as const;

    if (activeTab === 'Popular') {
      return {
        ...base,
        filter: 'Popular' as const,
        ...(category
          ? { type: category as 'ideas' | 'videos' | 'opinions' | 'analytics' | 'softwares' }
          : {}),
      };
    }
    if (activeTab === 'Editors') {
      return { ...base, filter: 'Popular' as const, type: 'opinions' as const };
    }
    if (activeTab === 'ForYou') {
      return { ...base, filter: 'ForYou' as const };
    }
    return { ...base, filter: 'Following' as const };
  }, [activeTab, currentPage, sortType, category]);

  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPostsQuery(postsArgs, {
    skip: q.length > 0,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const { data: favoritePostsData, isLoading: isFavoritesLoading } = useGetFavoritePostsQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const favoritePostIds = favoritePostsData?.data.map((post) => post.id) || [];

  const paginationData =
    q.length > 0
      ? !isPostSearch
        ? {
            totalPages: searchUsersResponse?.pagination?.total_pages || 1,
            currentPage: searchUsersResponse?.pagination?.current_page || 1,
          }
        : {
            totalPages: searchResponse?.pagination?.total_pages || 1,
            currentPage: searchResponse?.pagination?.current_page || 1,
          }
      : {
          totalPages: postsData?.pagination?.total_pages || 1,
          currentPage: postsData?.pagination?.current_page || currentPage,
        };

  if (isPostsLoading || isFavoritesLoading || isSearchLoading || isUsersLoading) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        <div className='w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (postsError || isSearchError) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        Ошибка загрузки: {postsError ? 'Не удалось загрузить посты' : 'Не удалось выполнить поиск'}
      </div>
    );
  }

  return (
    <section className='flex items-start gap-6 justify-center mt-6'>
      <div>
        <div className='flex flex-col gap-6'>
          {q ? (
            <div className='flex flex-col gap-6'>
              <p className='text-[39px] text-center  font-semibold text-lighterAluminum overflow-hidden leading-[48px] max-w-[712px] break-words'>
                {resultSearchString}
              </p>
            </div>
          ) : (
            <ButtonsPanel
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            />
          )}
          <div className='flex justify-between'>
            {searchKind !== 'users' && (
              <div className='flex flex-start gap-[16px]'>
                <div className='w-[124px] flex items-center bg-transparent border border-regaliaPurple custom-bg-blur rounded-[8px] text-[15px] font-bold z-10'>
                  <Select
                    value={category}
                    options={options}
                    placeholder='All Posts'
                    onChange={handleTypeChange}
                    icon={<IconDown width={20} height={20} />}
                    iconPosition='right'
                    className='text-lighterAluminum'
                    classNameMenuItem='hover:bg-regaliaPurple'
                  />
                </div>
                <Button
                  variant={category === 'videos' ? 'gradient' : 'ghostPurpule'}
                  className='max-w-[145px]'
                  onClick={() => handleTypeChange(category === 'videos' ? '' : 'videos')}
                  icon={<VideoIcon />}
                  aria-pressed={category === 'videos'}
                >
                  Videos Only
                </Button>
                <Button
                  variant='ghostPurpule'
                  className='flex justify-center items-center text-[#ffffff] w-fit'
                  onClick={() => handleOpenEditor()}
                >
                  Create post
                </Button>
              </div>
            )}
            {isPostSearch && (
              <div className='flex items-center'>
                <div
                  className={cn(
                    `flex justify-center items-center size-8 rounded-[4px] cursor-pointer bg-[#212329] backdrop-blur-[100px] text-lighterAluminum`,
                    {
                      ['bg-purple text-white']: sortFilter === 'created',
                    },
                  )}
                  onClick={() => handleSortChange('created')}
                >
                  <IconTime />
                </div>
                <div
                  className={cn(
                    `flex justify-center items-center size-8 rounded-[4px] cursor-pointer bg-[#212329] text-lighterAluminum`,
                    {
                      ['bg-purple text-white']: sortFilter === 'popular',
                    },
                  )}
                  onClick={() => handleSortChange('popular')}
                >
                  <IconPopular />
                </div>
              </div>
            )}
          </div>

          {q ? (
            isPostSearch ? (
              searchResponse?.data?.length ? (
                searchResponse.data.map((post) => {
                  if (!isPost(post)) return null;
                  return (
                    <Post
                      isBlur={post?.need_payment}
                      liked={post.liked}
                      likeCount={post?.like_count}
                      key={post.id}
                      userEmail={post.user_email}
                      userId={post.user_id}
                      postId={post.id}
                      title={post.title}
                      message={' '}
                      typeTag={isPostType(post.type) ? post.type : 'ideas'}
                      user_name={post.user_name}
                      bgImg={post.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
                      isFavorite={favoritePostIds.includes(post.id)}
                      tags={post.tags?.map((tag) => tag.name) || []}
                      created={post.created}
                      videoSrc={post?.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
                      fileType={post?.blocks?.[1]?.files?.[0]?.type}
                    />
                  );
                })
              ) : (
                <NothingNew />
              )
            ) : searchUsersResponse?.data?.length ? (
              searchUsersResponse.data.map((value, index, array) => (
                <SearchElement
                  key={value.id}
                  onClick={() => router.push(`/user/${value.id}`)}
                  title={value.username}
                  icon={
                    <Image
                      src={value.avatar_url || '/def-logo.png'}
                      alt='Logo'
                      className='p-0 size-11 rounded-full'
                    />
                  }
                  classNames={cn({
                    'border-b border-onyxGrey': index !== array.length - 1,
                  })}
                />
              ))
            ) : (
              <NothingNew />
            )
          ) : (
            <div className='flex flex-col gap-6 pb-12'>
              {postsData?.data?.length ? (
                postsData.data.map((post) => (
                  <Post
                    isBlur={post?.need_payment}
                    liked={post.liked}
                    likeCount={post?.like_count}
                    key={post.id}
                    userId={post.user_id}
                    postId={post.id}
                    userEmail={post.user_email}
                    title={post.title}
                    message={
                      post.blocks?.[1]?.files === null && !!post.blocks?.[1]?.content
                        ? post.blocks?.[1]?.content
                        : ' '
                    }
                    typeTag={isPostType(post.type) ? post.type : 'ideas'}
                    user_name={post.user_name}
                    bgImg={post.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
                    isFavorite={favoritePostIds.includes(post.id)}
                    tags={post.tags?.map((tag) => tag.name) || []}
                    created={post.created}
                    videoSrc={post?.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
                    fileType={post?.blocks?.[1]?.files?.[0]?.type}
                  />
                ))
              ) : (
                <NothingNew />
              )}
            </div>
          )}
        </div>

        <Pagination
          totalPages={paginationData.totalPages}
          currentPage={paginationData.currentPage}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
      {isEditorOpen && (
        <ModalWrapper
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(!isEditorOpen)}
          contentClassName='!pr-0 !overflow-scroll rounded-[8px] flex justify-center h-full pt-10 '
          className='!w-full h-full max-h-full !max-w-full !flex !justify-center !p-6 !rounded-3xl !bg-[#000000A3] !backdrop-blur-[100px]'
          title=''
          titleClassName='text-[24px] mb-[0px]'
        >
          <PostEditor
            mode='create'
            userEmail={me?.email ?? ''}
            className='!justify-center'
            classNameContent='w-[1000px]'
            onSuccess={() => {}}
            onCancel={() => setIsEditorOpen(false)}
          />
        </ModalWrapper>
      )}
    </section>
  );
};

export default HomeScreen;
