'use client';

import Button from '../UI/Button/Button';
import Image from '../UI/Image';
import LockIcon from '@/assets/icons/post/lock.svg';
import BullishIcon from '@/assets/icons/bullish.svg';
import IconFavorites from '@/assets/icons/nav/favorites.svg';
import IconFavoritesFull from '@/assets/icons/nav/favorites-full.svg';
import IconMessage from '@/assets/icons/message.svg';
import IconMore from '@/assets/icons/icon-more.svg';
import { FC, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Profile from '../Header/components/Profile';
import SubscribeButton from '../SubscribeButton/SubscribeButton';
import IconPin from '@/assets/icons/dropdown/icon-pin.svg';
import IconCopy from '@/assets/icons/dropdown/icon-copy.svg';
import IconTwitter from '@/assets/icons/dropdown/icon-twitter.svg';
import IconFacebook from '@/assets/icons/dropdown/icon-facebook.svg';
import IconReport from '@/assets/icons/dropdown/icon-report.svg';
import DropDown from '../UI/DropDown/DropDown';
import {
  ContentBlock,
  useAddFavoritePostMutation,
  useDeletePostMutation,
  useGetPostCommentsQuery,
  useRemoveFavoritePostMutation,
} from '@/store/postsApi';
import { formatDate } from '@/utilts/date-format';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from '@/store/store';
import LikeButton from '../UI/LikeButton';
import { Download, FileText } from 'lucide-react';
import { formatFileSize } from '@/helpers/formatFileSize';
import { getAudioDuration } from '@/helpers/getAudioDuration';
import { useAppDispatch } from '@/store/hooks';
import { setSearchString } from '@/store/slices/searchSlice';
import ModalWrapper from '../UI/ModalWrapper';
import { PaymentModal } from './components/PaymentModal/PaymentModal';
import { countComments } from '@/utilts/comentsCounter';
import { useLikePostMutation, useUnlikePostMutation } from '@/store/likesApi';
import { TPostType } from '@/store/api';
import { AudioPlayer } from './components/AudioPlayer/AudioPlayer';

interface IProps {
  userId?: string;
  postId?: string;
  liked?: string;
  likeCount?: number;
  user_name?: string;
  message?: string;
  typeTag: TPostType;
  isBlur?: boolean;
  textScript?: string;
  videoSrc?: string;
  title?: string;
  bgImg?: string;
  isFavorite?: boolean;
  tags?: string[];
  created?: string;
  fileType?: string;
  variant?: 'short' | 'long';
  blocks?: ContentBlock[];
  files?: { url: string; type: string; name: string; file_size: number; user_name?: string }[];
  userEmail?: string;
}

const Post: FC<IProps> = ({
  liked,
  likeCount,
  userId,
  postId,
  message,
  typeTag,
  isBlur = false,
  videoSrc,
  title,
  bgImg,
  isFavorite = false,
  tags,
  created,
  fileType,
  variant = 'short',
  files,
  blocks,
  userEmail,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [duration, setDuration] = useState(0);
  const [isOpenPaymentModal, setIsOpenpaymentModal] = useState(false);
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const isOwn = userId === currentUserId;

  const { data: comments } = useGetPostCommentsQuery({ post_id: postId ?? '' });

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [addFavoritePost] = useAddFavoritePostMutation();
  const [removeFavoritePost] = useRemoveFavoritePostMutation();
  const [deletePost] = useDeletePostMutation();
  const dispatch = useAppDispatch();

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  const handleUnlock = () => {
    setIsOpenpaymentModal(true);
  };

  const handleTagClick = (tag: string) => {
    router.push('/popular?category=tags');
    dispatch(setSearchString(tag));
  };

  const handleToggleFavorite = async () => {
    if (!postId) return;

    try {
      if (localFavorite) {
        await removeFavoritePost(postId);
      } else {
        await addFavoritePost(postId);
      }
      setLocalFavorite((prev) => !prev);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;

    try {
      await deletePost(postId).unwrap();
      setIsOpen(false);
      window.location.reload();
    } catch {
      alert('You cannot delete a post that is not yours.');
    }
  };

  const options = [
    {
      items: [
        {
          name: 'Follow IDEa',
          icon: <IconPin className='w-4 h-4' />,
        },
        {
          name: 'Copy',
          icon: <IconCopy className='w-4 h-4' />,
        },
      ],
    },
    {
      title: 'Share to:',
      items: [
        {
          name: 'Twitter',
          icon: <IconTwitter className='w-4 h-4' />,
        },
        {
          name: 'Facebook',
          icon: <IconFacebook className='w-4 h-4' />,
        },
      ],
    },
    {
      items: [
        {
          name: 'Delete',
          icon: <IconReport className='w-4 h-4' />,
          isDanger: true,
          onClick: handleDeletePost,
        },
      ],
    },
  ];

  const renderFile = (url: string, type: string, name: string, file_size: number) => {
    if (type === 'video') {
      return (
        <video key={url} controls className='w-full h-[382px] rounded-md object-cover'>
          <source src={url} type='video/mp4' />
        </video>
      );
    }
    if (type === 'audio') {
      if (url) {
        getAudioDuration(url).then(setDuration);
      }

      return (
        <>
          <AudioPlayer
            track={{
              id: '0',
              src: url,
              title: files?.find((file) => file.user_name)?.user_name ?? name,
              duration: duration,
              downloadUrl: url,
              artist: files?.find((file) => file.user_name)?.user_name ?? name,
            }}
          />
        </>
      );
    }
    if (type === 'document') {
      return (
        <div
          key={url}
          className='flex pt-4 bg-moonlessNight items-center justify-between p-3 rounded-2xl overflow-hidden'
        >
          <div className='flex items-center gap-2'>
            <div className='p-2.5 bg-primary rounded-full'>
              <FileText className='size-6' />
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>{name}</p>
              <span className='text-secondary font-bold'>{formatFileSize(file_size)}</span>
            </div>
          </div>

          <a href={url} download>
            <Download className='size-6 text-secondary' />
          </a>
        </div>
      );
    }
    if (type === 'photo') {
      return (
        <Image
          key={url}
          src={url}
          alt='post media'
          className='w-full h-[382px] object-cover rounded-md'
        />
      );
    }
    return null;
  };

  const renderContent = () => {
    if (variant === 'long') {
      return (
        <>
          {blocks?.map((block) => (
            <div key={block.id} className='flex flex-col gap-4 w-full'>
              <div className='w-full break-words'>{(!block?.files && block?.content) ?? ''}</div>
              {block?.files?.map(
                (f: { url: string; type: string; name: string; file_size: number }) =>
                  renderFile(f.url, f.type, f.name, f.file_size),
              )}
            </div>
          ))}
        </>
      );
    }

    const safeUrl = videoSrc || bgImg;
    return safeUrl
      ? renderFile(safeUrl, fileType || 'photo', files?.[0]?.name || '', files?.[0]?.file_size || 0)
      : null;
  };

  return (
    <div className='w-[712px] px-6 pt-6 pb-[16px] rounded-3xl border border-regaliaPurple custom-bg-blur '>
      <div className='flex items-center justify-between'>
        <Profile
          type={typeTag}
          date={created ? formatDate(created) : 'January 31, 5:10 PM'}
          userEmail={userEmail}
          // onClick={() => router.push(`/user/${userId}`)}
        />
        <div className='flex items-center gap-2'>
          {!isOwn && <SubscribeButton type='text' userId={userId || ''} />}
          <div ref={containerRef} className='relative'>
            <div
              className='p-2 bg-transparent rounded-lg w-11 h-11 flex items-center justify-center'
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <IconMore className='w-6 h-6 hover:cursor-pointer' />
            </div>

            {isOpen && (
              <div className='absolute left-0 top-full mt-2'>
                <DropDown className='border border-regaliaPurple' groups={options} />
              </div>
            )}
          </div>
        </div>
      </div>

      <section className='flex flex-col gap-4'>
        {title ? <div className='text-2xl font-bold mt-6'>{title}</div> : <div></div>}

        <div className={clsx('relative ', { 'min-h-[300px]': isBlur && !isOwn })}>
          <div className={isBlur && !isOwn ? 'filter blur-md' : ''}>
            {message ? (
              <>
                <p className='break-words whitespace-pre-line'>{message}</p>
                {variant === 'short' && (
                  <span
                    className='text-[#A06AFF] text-[16px] pb-4 border-[#A06AFF] w-fit cursor-pointer'
                    onClick={() => router.push(`/post/${postId}`)}
                  >
                    Learn more
                  </span>
                )}
              </>
            ) : null}
            <div className='relative flex flex-col gap-4 w-full'>{renderContent()}</div>
            {tags && tags.length > 0 && (
              <div className='w-full'>
                <div className='flex gap-2 flex-wrap mt-4'>
                  {tags.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleTagClick(item)}
                      className='px-2 py-[2px] bg-regaliaPurple items-center rounded cursor-pointer text-sm text-white'
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className='flex items-center justify-between mt-[18px]'>
              <div className='flex items-center gap-6 '>
                <Button
                  fullWidth
                  icon={<BullishIcon />}
                  className='!px-1 !py-0 !gap-1 !rounded-[4px] !text-[12px] !font-extrabold max-h-[20px] bg-[#1C3430]'
                >
                  Bullish
                </Button>
                {postId && (
                  <LikeButton
                    onLike={() => likePost(postId)}
                    onUnlike={() => unlikePost(postId)}
                    likeCount={likeCount}
                    isLiked={!!liked}
                  />
                )}
                <div className='flex items-center gap-[6px] opacity-[0.48]'>
                  <IconMessage
                    className='cursor-pointer'
                    onClick={() => router.push(`/post/${postId}`)}
                  />
                  <span className='text-[13px] font-bold leading-[17.73px]'>
                    {countComments(comments)}
                  </span>
                </div>
              </div>
              <div onClick={handleToggleFavorite} className='cursor-pointer'>
                {localFavorite ? <IconFavoritesFull /> : <IconFavorites />}
              </div>
            </div>
          </div>
          {isBlur && !isOwn && (
            <div className='absolute inset-0 flex flex-col items-center justify-center rounded-[8px] text-webGray'>
              <LockIcon width={40} height={40} />
              <p className='mt-4 mb-8 max-w-[243px] text-[15px] font-bold text-center'>
                Access to this content is restricted. Purchase to gain full access.
              </p>
              <Button
                variant='gradient'
                className='px-6 py-3 text-[15px] font-semibold items-center !h-auto '
                onClick={handleUnlock}
              >
                Get Access
              </Button>
            </div>
          )}
          {isOpenPaymentModal && (
            <ModalWrapper
              isOpen={isOpenPaymentModal}
              onClose={() => setIsOpenpaymentModal(!isOpenPaymentModal)}
              contentClassName='!pr-0 !overflow-hidden rounded-[8px]'
              className='!w-[468px] !p-6 !rounded-3xl !bg-[#0C101480] !backdrop-blur-[100px] border border-regaliaPurple min-w-[512px]'
              title='Confirm Your Purchase'
              titleClassName='pb-3 border-b-[1px] border-regaliaPurple text-[24px] mb-[0px]'
            >
              <PaymentModal />
            </ModalWrapper>
          )}
        </div>
      </section>
    </div>
  );
};

export default Post;
