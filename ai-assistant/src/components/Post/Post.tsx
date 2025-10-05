'use client';

import Image from 'next/image';
import LockIcon from '@/assets/post/lock.svg';
import IconFavorites from '@/assets/nav/favorites.svg';
import IconFavoritesFull from '@/assets/nav/favorites-full.svg';
import IconMessage from '@/assets/message.svg';
import IconMore from '@/assets/icon-more.svg';
import { FC, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import IconPin from '@/assets/dropdown/icon-pin.svg';
import IconCopy from '@/assets/dropdown/icon-copy.svg';
import IconTwitter from '@/assets/dropdown/icon-twitter.svg';
import IconFacebook from '@/assets/dropdown/icon-facebook.svg';
import IconReport from '@/assets/dropdown/icon-report.svg';
import clsx from 'clsx';
import Button from '../ui/Button/Button';
import LikeButton from '../ui/LikeButton';
import SubscribeButton from '../ui/SubscribeButton/SubscribeButton';
import Avatar from '../ui/Avatar/Avatar';
import Tag from '../ui/Tag';
import { TagType } from '../ui/Tag/types';
import Paper from '../ui/Paper/Paper';
import { MarketTag } from '../MarketTags/MarketTag';

export interface PostProps {
  isOwn?: boolean;
  userId?: string;
  postId?: string;
  liked?: string;
  likeCount?: number;
  user_name?: string;
  message?: string;
  typeTag: TagType;
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
  files?: { url: string; type: string; name: string; file_size: number }[];
}

const Post: FC<PostProps> = ({
  liked,
  likeCount,
  userId,
  postId,
  message,
  user_name,
  typeTag = 'video',
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
  isOwn = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(isFavorite);
  const [duration, setDuration] = useState<string>('0:00');

  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleUnlock = () => {
    router.push(`/payment/${postId}`);
  };

  const handleToggleFavorite = () => setLocalFavorite((prev) => !prev);

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
          //   onClick: handleDeletePost,
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
        // getAudioDuration(url).then(setDuration);
      }

      return (
        <div
          key={url}
          className='flex pt-4 bg-moonlessNight items-center justify-between p-3 rounded-2xl overflow-hidden'
        >
          <div className='flex items-center gap-2'>
            <div className='p-2.5 bg-primary rounded-full'>
              {/* <Music className='size-6' /> */}
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>{name}</p>
              <span className='text-secondary font-bold'>{duration}</span>
            </div>
          </div>

          <a href={url} download>
            {/* <Download className='size-6 text-secondary' /> */}
          </a>
        </div>
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
              {/* <FileText className='size-6' /> */}
            </div>
            <div className='flex flex-col'>
              <p className='text-sm font-bold'>{name}</p>
              {/* <span className='text-secondary font-bold'>{formatFileSize(file_size)}</span> */}
            </div>
          </div>

          <a href={url} download>
            {/* <Download className='size-6 text-secondary' /> */}
          </a>
        </div>
      );
    }
    if (type === 'photo') {
      return (
        <div className=' relative 2w-full h-[382px] object-cover rounded-md'>
          <Image key={url} src={url} sizes='100vw' objectFit='cover' fill alt='post media' />
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (variant === 'long' && files?.length) {
      return (
        <div className='flex flex-col gap-4 w-full'>
          {files.map((f: { url: string; type: string; name: string; file_size: number }) =>
            renderFile(f.url, f.type, f.name, f.file_size),
          )}
        </div>
      );
    }

    const safeUrl = videoSrc || bgImg;
    return safeUrl
      ? renderFile(safeUrl, fileType || 'photo', files?.[0]?.name || '', files?.[0]?.file_size || 0)
      : null;
  };

  return (
    <Paper className='p-4'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center justify-start gap-2'>
          <Avatar size='small' />
          <div className='cursor-pointer'>
            <span className='text-base font-semibold leading-[21.82px]'>
              {user_name || 'John Smith'}
            </span>

            <div className='flex items-center gap-2'>
              {typeTag && <Tag type={typeTag} />}
              {created && <span className={'text-[12px] font-bold opacity-[0.48]'}>{created}</span>}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          {!isOwn && <SubscribeButton userId={userId || ''} />}
          <div ref={containerRef} className='relative'>
            <IconMore className='w-6 h-6 hover:cursor-pointer' />

            {isOpen && (
              <div className='absolute left-0 top-full mt-2'>
                {/* <DropDown groups={options} /> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className='flex flex-col gap-4'>
        {title ? <div className='text-2xl font-bold mt-6'>{title}</div> : <div></div>}

        <div className={clsx('relative ', { 'min-h-[300px]': isBlur })}>
          <div className={isBlur ? 'filter blur-md' : ''}>
            {message ? (
              <>
                <p className=' text-[15px] break-words whitespace-pre-line mb-4'>{message}</p>
                {variant === 'short' && (
                  <span
                    className='text-purple text-[16px] border-b  border-purple w-fit cursor-pointer '
                    // onClick={() => router.push(`/post/${postId}`)}
                  >
                    Learn more
                  </span>
                )}
              </>
            ) : null}
            <div className='relative flex flex-col gap-4 w-full mt-4'>{renderContent()}</div>
            {tags && tags.length > 0 && (
              <div className='w-full'>
                <div className='flex gap-2 flex-wrap mt-4'>
                  {tags.map((item, index) => (
                    <div
                      key={index}
                      //   onClick={() => handleTagClick(item)}
                      className='px-2 py-[2px] bg-[#262D34] items-center rounded cursor-pointer text-sm text-white'
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className='flex items-center justify-between mt-[18px]'>
              <div className='flex items-center gap-2 '>
                <MarketTag isPositive>Bullish</MarketTag>
                <LikeButton likeCount={likeCount} isLiked={liked} />
                <div
                  className='flex items-center gap-[6px]'
                  // onClick={() => {
                  //   router.push('/post/1');
                  // }}
                >
                  <IconMessage
                    className='cursor-pointer'
                    // onClick={() => router.push(`/post/${postId}`)}
                  />
                  <span className='text-[13px] font-bold text-webGray'>20</span>
                </div>
              </div>
              <div onClick={() => handleToggleFavorite} className='cursor-pointer'>
                {localFavorite ? <IconFavoritesFull /> : <IconFavorites />}
              </div>
            </div>
          </div>
          {isBlur && (
            <div className='absolute inset-0 flex flex-col items-center justify-center rounded-[8px] text-webGray'>
              <LockIcon width={40} height={40} />
              <p className='mt-4 mb-8 max-w-[243px] text-[15px] font-bold text-center'>
                Access to this content is restricted. Purchase to gain full access.
              </p>
              <Button
                className='px-6 py-3 text-[15px] font-semibold items-center !h-auto text-white'
                onClick={handleUnlock}
              >
                Unlock full content
              </Button>
            </div>
          )}
        </div>
      </section>
    </Paper>
  );
};

export default Post;
