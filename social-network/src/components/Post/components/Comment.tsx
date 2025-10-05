'use client';

import Button from '@/components/UI/Button/Button';

import { FC, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CommentSortBy,
  useCreateNewCommentMutation,
  useGetPostCommentsQuery,
} from '@/store/postsApi';
import { Comment } from './SingleComment/SingleComment';
import { TopPart } from './SingleComment/TopPart';
import { countComments } from '@/utilts/comentsCounter';

interface CommentsProps {
  userId?: string;
}

const Comments: FC<CommentsProps> = ({ userId }) => {
  const [text, setText] = useState<string>('');
  const [sortBy, setSortBy] = useState<CommentSortBy>('created_at');
  const { postId } = useParams<{ postId: string }>();
  const { data: comments } = useGetPostCommentsQuery({ post_id: postId ?? '', sort_by: sortBy });
  const [createComment] = useCreateNewCommentMutation();
  const [visibleCount, setVisibleCount] = useState(16);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 16);
  };

  const remainingComments = !!comments?.length && comments?.length - visibleCount;
  const nextLoadCount = !!remainingComments && remainingComments > 16 ? 16 : remainingComments;

  const visibleItems = comments?.slice(0, visibleCount);
  const hasMoreItems = comments?.length && visibleCount < comments?.length;

  const handleCreateComment = (parentId?: string) => {
    createComment({
      postId: postId,
      parentId: parentId,
      content: text,
    });
    setText('');
  };

  return (
    <div className='bg-transparent backdrop-blur-[100px] rounded-3xl border border-regaliaPurple px-6 pt-4 pb-6'>
      <div className='flex flex-col gap-[25px]'>
        <TopPart
          commentsCount={countComments(comments)}
          activeFilter={sortBy}
          onChangeFilter={setSortBy}
        />
        <div className='flex flex-col gap-4'>
          <div className='px-4 py-2 w-full border-[1.5px] border-[#2E2744] rounded-[5px] h-[82px]'>
            <textarea
              value={text ?? ''}
              className='w-full bg-transparent resize-none scrollbar outline-none text-[15px] placeholder:font-semibold'
              placeholder='Comment...'
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <Button
              onClick={() => handleCreateComment()}
              className='!w-[156px] h-8  flex items-center justify-center'
              variant='gradient'
            >
              Send
            </Button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        {visibleItems?.map((comment) => (
          <Comment
            createComment={handleCreateComment}
            key={comment.id}
            replies={comment.children}
            comment={comment}
            userId={userId}
            userEmail={comment.user_email}
            postId={postId}
            level={1}
          />
        ))}
      </div>

      {hasMoreItems && (
        <div className='mt-6 flex flex-1 justify-center'>
          <Button
            onClick={handleLoadMore}
            className='w-[156px] font-bold items-center'
            variant='gradient'
          >
            <span>{nextLoadCount} more comments</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Comments;
