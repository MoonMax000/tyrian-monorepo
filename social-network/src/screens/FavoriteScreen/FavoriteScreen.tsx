'use client';

import { useGetFavoritePostsQuery } from '@/store/postsApi';
import Post from '@/components/Post/Post';
import Pagination from '@/components/UI/Pagination';
import { useEffect, useState } from 'react';
import { isPostType } from '@/store/api';

const FavoriteScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: favoritePosts,
    isLoading,
    error,
  } = useGetFavoritePostsQuery(
    { page: currentPage, page_size: 10 },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );

  useEffect(() => {
    if (isLoading || error) return;

    const noData = favoritePosts?.data?.length === 0;
    const totalPages = favoritePosts?.pagination?.total_pages ?? 10;

    if (noData && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [favoritePosts, isLoading, error, currentPage]);

  if (isLoading) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        <div className='w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        Ошибка загрузки избранных постов
      </div>
    );
  }

  return (
    <section className='flex items-start  justify-center gap-6 mt-28'>
      <div className='flex flex-col gap-6 w-[712px]'>
        {favoritePosts?.data.length ? (
          favoritePosts.data.map((post) => (
            <Post
              isBlur={post?.need_payment}
              liked={post.liked}
              likeCount={post?.like_count}
              key={post.id}
              userId={post.user_id}
              postId={post.id}
              title={post.title}
              message={post.content}
              typeTag={isPostType(post.type) ? post.type : 'ideas'}
              user_name={post.user_name}
              bgImg={post.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
              isFavorite={true}
              tags={post.tags?.map((tag) => tag.name) || []}
              created={post.created}
              videoSrc={post?.blocks?.[1]?.files?.[0]?.url || post.media_url || undefined}
              fileType={post?.blocks?.[1]?.files?.[0]?.type}
            />
          ))
        ) : (
          <div className='flex w-[712px] justify-center text-[19px] text-purple'>
            There’s no favorite posts yet
          </div>
        )}
        {favoritePosts && (
          <Pagination
            totalPages={favoritePosts.pagination.total_pages}
            currentPage={favoritePosts.pagination.current_page}
            onChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </section>
  );
};

export default FavoriteScreen;
