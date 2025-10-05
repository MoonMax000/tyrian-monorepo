'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import Pagination from '@/components/UI/Pagination';
import Post from '@/components/Post';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';
import { setSearchCategory } from '@/store/slices/searchSlice';
import { useGetPostsQuery, useGetFavoritePostsQuery } from '@/store/postsApi';
import { isPostType } from '@/store/api';
import { SearchFilter } from '@/components/Header/components/SearchBar/types';

const NewScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPostsQuery(
    { page: currentPage, page_size: 10 },
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const { data: favoritePostsData, isLoading: isFavoritesLoading } = useGetFavoritePostsQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const favoritePostIds = favoritePostsData?.data.map((post) => post.id) || [];

  const sortedPosts =
    postsData?.data
      ?.slice()
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()) || [];

  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      dispatch(setSearchCategory(category as SearchFilter));
    }
  }, [searchParams]);

  if (isPostsLoading || isFavoritesLoading) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        <div className='w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        Ошибка загрузки постов
      </div>
    );
  }

  return (
    <section className='flex items-start justify-between gap-6'>
      <div>
        <div className='flex flex-col gap-6 pb-12'>
          {sortedPosts.map((post) => (
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
              videoSrc={post.files?.[0]?.url || post.media_url || undefined}
              fileType={post.files?.[0]?.type}
              isFavorite={favoritePostIds.includes(post.id)}
              created={post.created}
            />
          ))}
        </div>

        <Pagination
          totalPages={postsData?.pagination.total_pages || 1}
          currentPage={postsData?.pagination.current_page || 1}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
      <RecommendedList RecommendedList={recommendedData} />
    </section>
  );
};

export default NewScreen;
