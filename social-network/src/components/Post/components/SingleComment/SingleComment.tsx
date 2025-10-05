import { useGetUserByIdQuery } from '@/store/api';
import {
  CommentData,
  useCreateNewCommentMutation,
  useLikeCommentMutation,
  useRemoveCommentMutation,
  useUnlikeCommentMutation,
  useUpdateCommentMutation,
} from '@/store/postsApi';
import { useParams } from 'next/navigation';
import { FC, useMemo, useState } from 'react';
import IconMore from '@/assets/icons/icon-more.svg';
import Profile from '@/components/Header/components/Profile';
import Button from '@/components/UI/Button/Button';
import { formatChatDate } from '@/utilts/date-format';
import { CustomBorder, TBorderVariant } from './CustomBorder';
import { DropdownMenu } from '@/components/UI/Chat/DropdownMenu';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/utilts/cn';
import LikeButton from '@/components/UI/LikeButton';

interface CommentProps {
  comment: CommentData;
  replies?: CommentData[];
  userId?: string;
  postId?: string;
  userEmail?: string;
  createComment?: (arg?: string) => void;
  level: number;
}

export const Comment: FC<CommentProps> = ({ comment, replies = [], userId, level, userEmail }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data: user } = useGetUserByIdQuery(comment.user_id);
  const [isShowReplyForm, setIsShowReplyForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [createComment] = useCreateNewCommentMutation();
  const [removeComment] = useRemoveCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const { user: currentUser } = useAppSelector((state) => state);
  const { postId } = useParams<{ postId: string }>();

  const borderVariant: TBorderVariant = level >= 3 ? 'folded' : 'direct';
  const hasRecipes = replies.length > 0;

  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnlikeCommentMutation();

  const countNestedComments = (replies: CommentData[]): number => {
    return replies.reduce((count, reply) => {
      count += 1;
      if (reply.children && reply.children.length > 0) {
        count += countNestedComments(reply.children);
      }
      return count;
    }, 0);
  };

  const handleShowReplyForm = () => {
    setIsShowReplyForm((prev) => !prev);
  };

  const handleCreateReply = () => {
    createComment({
      postId: postId,
      parentId: comment.id,
      content: replyText,
    });
    setReplyText('');
    setIsShowReplyForm(false);
  };

  const handleUpdateComment = () => {
    updateComment({ id: comment.id, content: editedText });
    setEditedText('');
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (comment.user_id !== currentUser.id) {
      return;
    }
    setIsEditing((prev) => !prev);
    setEditedText(comment.content);
    setShowDropdown(false);
  };

  const handleRemove = () => {
    removeComment(comment.id);
  };

  const dropdownItems = [
    {
      name: 'Редактировать',
      onClick: () => handleEdit(),
    },
    {
      name: 'Удалить',
      onClick: () => handleRemove(),
    },
  ];

  const allRecipes = useMemo(() => {
    return countNestedComments(replies);
  }, [replies]);

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Profile
          avatar={comment?.avatar_url ?? ''}
          userEmail={userEmail ?? ''}
          user_name={user?.username}
          date={formatChatDate(comment.created_at)}
          // onClick={() => router.push(`/user/${userId}`)}
        />
        {isEditing ? (
          <>
            <div className='px-4 py-2 w-full border-[1.5px] border-[#FFFFFF29] rounded-[5px] h-[82px]'>
              <textarea
                value={editedText ?? ''}
                className='w-full bg-transparent resize-none scrollbar outline-none text-[15px] placeholder:font-semibold'
                placeholder='Edit your comment...'
                onChange={({ target: { value } }) => setEditedText(value)}
              />
            </div>
            <div className='flex pt-8 justify-end'>
              <Button onClick={() => handleUpdateComment()} className='!w-[156px] h-8 py-[6px]'>
                Update
              </Button>
            </div>
          </>
        ) : (
          <p className='text-[15px] font-semibold line-clamp-[13] break-all overflow-hidden'>
            {comment.content}
          </p>
        )}
      </div>

      <div className='flex items-center gap-[6px]'>
        <LikeButton
          onLike={() => likeComment(comment.id)}
          onUnlike={() => unlikeComment(comment.id)}
          likeCount={comment.likes_count}
          isLiked={comment.is_liked}
        />
      </div>

      <div className='flex items-center gap-4'>
        {hasRecipes && (
          <span
            className='text-[#A06AFF] cursor-pointer'
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? 'Hide' : `${allRecipes} Reply`}
          </span>
        )}
        <span onClick={handleShowReplyForm}>Reply</span>
        <IconMore
          onClick={() => setShowDropdown((prev) => !prev)}
          className='w-6 h-6 cursor-pointer'
        />

        {showDropdown && (
          <DropdownMenu className='absolute mt-2 left-[200px]' items={dropdownItems} />
        )}
      </div>

      {isShowReplyForm && (
        <div className='flex flex-col gap-4'>
          <div className='px-4 py-2 w-full min-w-[550px] border-[1.5px] border-[#FFFFFF29] rounded-[5px] h-[82px]'>
            <textarea
              value={replyText ?? ''}
              className='w-full bg-transparent resize-none scrollbar outline-none text-[15px] placeholder:font-semibold'
              placeholder='Your reply...'
              onChange={({ target: { value } }) => setReplyText(value)}
            />
          </div>
          <div className='flex  justify-end'>
            <Button
              onClick={() => handleCreateReply()}
              className='!w-[156px] h-8 items-center flex justify-center '
              variant='gradient'
            >
              Send
            </Button>
          </div>
        </div>
      )}

      {hasRecipes && isOpen && (
        <div className={cn('flex', { 'flex-col': level >= 3 })}>
          <CustomBorder variant={borderVariant} />

          <div className='flex flex-col gap-6'>
            {replies.map((reply) => (
              <Comment
                key={reply.id}
                comment={reply}
                replies={reply.children}
                userId={userId}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
