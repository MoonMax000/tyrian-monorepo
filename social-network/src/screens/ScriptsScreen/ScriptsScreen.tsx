'use client';

import React, { useState } from 'react';
import Post from '@/components/Post';
import Pagination from '@/components/UI/Pagination';
import { useAppSelector } from '@/store/hooks';
import { useGetPostsQuery } from '@/store/postsApi';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';
import IconNoContent from '@/assets/icons/icon-no-content.svg';
import { isPostType } from '@/store/api';

const ScriptsScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { searchString } = useAppSelector((state) => state.search);

  const {
    data: postsData,
    isLoading: isPostsLoading,
    error: postsError,
  } = useGetPostsQuery({ page: currentPage, page_size: 10 }, { refetchOnMountOrArgChange: true });

  const scriptPosts = postsData?.data?.filter((post) => post.type === 'softwares') || [];

  if (isPostsLoading) {
    return (
      <div className='flex w-[1080px] justify-center items-center py-20'>
        <div className='w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className='flex w-[1080px] justify-center items-center py-20 text-[19px] text-purple'>
        Ошибка загрузки постов
      </div>
    );
  }

  return (
    <section className='flex items-start gap-6'>
      <div className='flex flex-col gap-6 w-full pb-12'>
        {searchString && (
          <div>
            <p className='text-[15px] font-semibold'>
              Main <span className='opacity-50'>/ Скрипты</span>
            </p>
            <p className='text-[40px] text-center overflow-hidden leading-[48px] max-w-[712px] break-words'>
              Search results for the query ”{searchString}”
            </p>
          </div>
        )}

        {scriptPosts.length ? (
          <>
            {scriptPosts.map((post) => (
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
                created={post.created}
                videoSrc={post.files?.[0]?.url || post.media_url || undefined}
                fileType={post.files?.[0]?.type}
              />
            ))}

            <Pagination
              totalPages={postsData?.pagination.total_pages || 1}
              currentPage={postsData?.pagination.current_page || 1}
              onChange={(page) => {
                setCurrentPage(page);
              }}
            />
          </>
        ) : (
          <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50 min-w-[712px]'>
            <IconNoContent className='w-10 h-10' />
            <span>Nothing new yet...</span>
          </div>
        )}
      </div>

      <RecommendedList RecommendedList={recommendedData} />
    </section>
  );
};

export default ScriptsScreen;
