'use client';

import IconPopular from '@/assets/icons/nav/popular.svg';
import IconTime from '@/assets/icons/time.svg';
import Profile from '@/components/UI/Profile/Profile';
import Button from '@/components/UI/Button/Button';

import IconLike from '@/assets/icons/like.svg';
import IconMore from '@/assets/icons/icon-more.svg';
import clsx from 'clsx';
import { useMemo, useState } from 'react';

const comments: CommentItem[] = [
  {
    id: 1,
    date: '6 hours ago',
    text: 'Following your lead, I’m reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it’s at. Thanks. At first glance, it’s a tedious task, but with a strong upward move, it could pay off really well.',
    likes: '25',
    replies: [
      {
        id: 2,
        date: '6 hours ago',
        text: 'Thank you, John Smith!',
        likes: '25',
        replies: [
          {
            id: 3,
            date: '6 hours ago',
            text: 'At your service, John Smith!',
            likes: '25',
            replies: [],
          },
        ],
      },
    ],
  },
  {
    id: 4,
    date: '6 hours ago',
    text: 'Following your lead, I’m reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it’s at. Thanks. At first glance, it’s a tedious task, but with a strong upward move, it could pay off really well.',
    likes: '25',
    replies: [
      {
        id: 5,
        date: '6 hours ago',
        text: 'At your service, John Smith!',
        likes: '25',
        replies: [],
      },
    ],
  },
  {
    id: 6,
    date: '6 hours ago',
    text: 'Following your lead, I’m reviewing my limit orders. Adjusting some, adding others. The only thing missing is some kind of alphabetical index for the coins—something you can glance at and immediately see whether a coin is in the list and what stage it’s at. Thanks. At first glance, it’s a tedious task, but with a strong upward move, it could pay off really well.',
    likes: '25',
    replies: [],
  },
];

interface CommentItem {
  id: number;
  date: string;
  text: string;
  likes: string;
  replies?: CommentItem[];
}

interface CommentProps {
  comment: CommentItem;
  replies?: CommentItem[];
}

const Comments = () => {
  const [text, setText] = useState<string>('');

  return (
    <div className='custom-bg-blur rounded-3xl border border-regaliaPurple px-4 pt-4 pb-6'>
      <div className='flex flex-col gap-[25px]'>
        <TopPart />
        <div className='flex flex-col gap-4'>
          <div className='px-4 py-2 w-full border-[1.5px] border-[#2E2744] rounded-[5px] h-[82px]'>
            <textarea
              value={text ?? ''}
              className='w-full !bg-transparent resize-none scrollbar outline-none text-[15px] placeholder:font-semibold'
              placeholder='Comment...'
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className='flex justify-end'>
            <Button className='!w-[180px] h-7 py-[6px] text-[15px]'>Send</Button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} replies={comment.replies} />
        ))}
      </div>
      <div className='mt-6 flex flex-1 justify-center'>
        <Button className='w-[156px] h-7 font-bold items-center'>
          <span>16 more comments</span>
        </Button>
      </div>
    </div>
  );
};

const Comment: React.FC<CommentProps> = ({ comment, replies = [] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasRecipes = replies.length > 0;

  const countNestedComments = (replies: CommentItem[]): number => {
    return replies.reduce((count, reply) => {
      count += 1;
      if (reply.replies && reply.replies.length > 0) {
        count += countNestedComments(reply.replies);
      }
      return count;
    }, 0);
  };

  const allRecipes = useMemo(() => {
    return countNestedComments(replies);
  }, [replies]);

  return (
    <section className='flex flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <Profile date={comment.date} />
        <p className='text-[15px] font-medium'>{comment.text}</p>
      </div>

      <div className='flex items-center gap-[6px]'>
        <IconLike />
        <span className='text-body-12 opacity-[0.48]'>{comment.likes}</span>
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
        <span>Reply</span>
        <IconMore className='w-6 h-6 cursor-pointer' />
      </div>

      {hasRecipes && isOpen && (
        <div className='flex'>
          <CustomBorder />

          <div className='flex flex-col gap-6'>
            {replies.map((reply) => (
              <Comment key={reply.id} comment={reply} replies={reply.replies} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

interface CustomBorderProps {
  className?: string;
}

function CustomBorder({ className }: CustomBorderProps) {
  return (
    <div
      className={clsx(
        'rounded-bl-lg border-b-[2px] border-l-[2px] border-[#FFFFFF29] w-5 h-8 mr-3',
        className,
      )}
    />
  );
}

function TopPart() {
  return (
    <div className='flex items-center justify-between'>
      <h1 className='text-[24px] font-semibold'>87 comments</h1>
      <div className='flex items-center gap-1 p-1 rounded-lg border border-regaliaPurple'>
        <div className='flex justify-center items-center size-[26px] rounded-[4px] bg-transparent'>
          <IconTime />
        </div>

        <div className='flex justify-center items-center size-8 bg-gradient rounded-[4px]'>
          <IconPopular />
        </div>
      </div>
    </div>
  );
}

export default Comments;
