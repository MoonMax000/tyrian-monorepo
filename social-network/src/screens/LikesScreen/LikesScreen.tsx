'use client';
import { FC, useEffect, useState } from 'react';
import AllIcon from '@/assets/icons/nav/all.svg';
import VideoIcon from '@/assets/icons/nav/video.svg';
import IdeaIcon from '@/assets/icons/nav/ideas.svg';
import ScriptIcon from '@/assets/icons/nav/scripts.svg';
import FilterSelect, { IFilterEl } from '@/components/UI/FilterSelect/FilterSelect';
import { useGetLikedPostsQuery } from '@/store/likesApi';
import Post from '@/components/Post';
import { useGetFavoritePostsQuery } from '@/store/postsApi';
import IconNoContent from '@/assets/icons/icon-no-content.svg';
import Pagination from '@/components/UI/Pagination';
import { isPostType } from '@/store/api';

type FilterValue = 'all' | 'video' | 'ideas' | 'script';

const filters: IFilterEl<FilterValue>[] = [
  { label: 'ALL', value: 'all', icon: <AllIcon width={16} height={16} /> },
  { label: 'VIDEO', value: 'video', icon: <VideoIcon width={16} height={16} /> },
  { label: 'IDEA', value: 'ideas', icon: <IdeaIcon width={16} height={16} /> },
  { label: 'SCRIPT', value: 'script', icon: <ScriptIcon width={16} height={16} /> },
];

const LikesScreen: FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterValue>('all');
  const [page, setPage] = useState(1);

  const handleFilterChange = (value: FilterValue) => {
    setSelectedFilter(value);
    setPage(1);
  };

  const { data, isLoading, refetch } = useGetLikedPostsQuery(
    selectedFilter === 'all'
      ? {
          sort_type: 'latest',
          page,
        }
      : {
          sort_type: 'latest',
          post_type: selectedFilter,
          page,
        },
  );

  console.log('AAAAAAAAAAAAAA', data);

  useEffect(() => {
    refetch();
  }, [page, refetch]);
  const { data: favoritePostsData, isLoading: isFavoritesLoading } = useGetFavoritePostsQuery(
    {},
    { refetchOnMountOrArgChange: true, refetchOnFocus: true },
  );

  const favoritePostIds = favoritePostsData?.data.map((post) => post.id) || [];

  if (isLoading || isFavoritesLoading) {
    return (
      <div className='flex w-[1080px] justify-center text-[19px] text-purple'>
        <div className='w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      <FilterSelect<FilterValue>
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        filters={filters}
        className='max-w-[136px]'
      />
      {data?.data.length ? (
        <>
          <div className='flex flex-col gap-6 pb-12'>
            {data?.data.map((post) => (
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
                bgImg={
                  post.files?.[0]?.url || (post.media_url?.trim() ? post.media_url : undefined)
                }
                isFavorite={favoritePostIds.includes(post.id)}
                created={post.created}
                videoSrc={
                  post.files?.[0]?.url || (post.media_url?.trim() ? post.media_url : undefined)
                }
                fileType={post.files?.[0]?.type}
              />
            ))}
            <Pagination
              totalPages={data?.pagination.total_pages || 1}
              currentPage={data?.pagination.current_page || 1}
              onChange={(page) => {
                setPage(page);
              }}
            />
          </div>
        </>
      ) : (
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50 min-w-[712px]'>
          <IconNoContent className='w-10 h-10' />
          <span>Nothing new yet...</span>
        </div>
      )}
    </div>
  );
};

export default LikesScreen;
