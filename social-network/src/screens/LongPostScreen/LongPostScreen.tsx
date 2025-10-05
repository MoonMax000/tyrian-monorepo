'use client';

import { FC, useState } from 'react';
import Comments from '@/components/Post/components/Comment';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';
import { useGetPostByIdQuery } from '@/store/postsApi';
import { useParams } from 'next/navigation';
import Post from '@/components/Post';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import ModalWrapper from '@/components/UI/ModalWrapper';
import PostEditor, { generateId } from '../../components/CreatePost';
import { isPostType } from '@/store/api';

const LongPostScreen: FC = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const params = useParams();
  const postId = params?.postId as string;
  const userId = useSelector((state: RootState) => state.user.id);
  const { data, isLoading, error } = useGetPostByIdQuery(`${postId}?userId=${userId}`);

  const post = data?.data;

  return (
    <section className='flex items-start gap-6 mt-10'>
      <div className='flex flex-col gap-6 w-[712px]'>
        {isLoading ? (
          <div className='text-white'>Loading...</div>
        ) : error || !post ? (
          <div className='text-red-500'>Post load error</div>
        ) : (
          <>
            {/* <Button
              className='w-[80px] h-[30px] !p-[4px]'
              onClick={() => setIsEditorOpen(!isEditorOpen)}
              variant='gradient'
            >
              Edit
            </Button> */}
            <Post
              isBlur={post.need_payment}
              liked={post.liked}
              likeCount={post.like_count}
              userId={post.user_id}
              userEmail={post.user_email}
              postId={post.id}
              title={post.title}
              message={' '}
              typeTag={isPostType(post.type) ? post.type : 'ideas'}
              user_name={post.user_name}
              bgImg={post.blocks?.[1]?.files?.[1]?.url || post.media_url || undefined}
              isFavorite={false}
              tags={post.tags?.map((tag) => tag.name) || []}
              created={post.created}
              videoSrc={post?.blocks?.[1]?.files?.[1]?.url || post.media_url || undefined}
              fileType={post.blocks?.[1]?.files?.[1]?.type}
              variant='long'
              blocks={post?.blocks.slice(1, post.blocks.length)}
              files={post?.blocks[1]?.files}
            />
          </>
        )}
        <Comments userId={post?.user_id} />
      </div>
      <RecommendedList RecommendedList={recommendedData} />
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
            userEmail={post?.user_email}
            mode='edit'
            postId='123'
            className='!justify-center'
            classNameContent='w-[1000px]'
            initialData={{
              title: 'Мой пост',
              blocks: [
                {
                  id: generateId(),
                  type: 'text',
                  content: post?.content ?? '',
                  order: 0,
                },
                {
                  id: generateId(),
                  type: 'file',
                  content: post?.files?.[0].url ?? '',
                  order: 1,
                },
              ],
              tags: ['тег1', 'тег2'],
              isPaid: false,
              payment: null,
            }}
            onSuccess={() => {}}
            onCancel={() => {}}
          />
        </ModalWrapper>
      )}
    </section>
  );
};

export default LongPostScreen;
