'use client';

import Avatar from '@/components/Avatar/Avatar';
import Button from '@/components/UI/Button/Button';

import IconGear from '@/assets/icons/gear.svg';
import Link from 'next/link';
import { useGetUserByIdQuery } from '@/store/api';
import SubscribeButton from '../SubscribeButton/SubscribeButton';
import { format } from 'date-fns';
import IconChat from '@/assets/icons/button/icon-chat.svg';
import { useRouter } from 'next/navigation';

interface Props {
  userId?: string;
  isOwn?: boolean;
}

const UserPanel = ({ userId, isOwn }: Props) => {
  const { data, isLoading, error } = useGetUserByIdQuery(userId!, { skip: !userId });

  const router = useRouter();
const handleClick = () => {
  router.push(`/chats/message/${userId}`);
};
  
  if (!userId) return null;

  return (
    <div className='bg-[#181A20] flex items-center flex-col py-6 gap-6 rounded-lg h-fit'>
      <Avatar src={data?.avatar_url} alt='User Avatar' size='lg' />
      <div className='flex flex-col gap-0.5 justify-center items-center'>
        <div className='flex'>
          {isLoading ? (
            <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
          ) : error ? (
            <h3 className='font-bold text-2xl gap-1'>No data</h3>
          ) : (
            <h3 className='font-bold text-2xl gap-1'>{data?.username}</h3>
          )}
          <div className='w-2.5 h-2.5 bg-[#46D74D] rounded-full'></div>
        </div>
        <p className='text-[12px] text-webGray font-bold'>
          Member since: {data?.created ? format(new Date(data.created), 'MMM dd, yyyy') : '—'}
        </p>
      </div>
      <div className='w-full flex justify-center items-center border-t border-b border-onyxGrey'>
        <div className='flex-1 py-4 px-2 flex flex-col gap-0.5 justify-center items-center'>
          {isLoading ? (
            <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
          ) : error ? (
            <h5 className='text-[19px] font-bold'>No data</h5>
          ) : (
            <h5 className='text-[19px] font-bold'>{data?.follower_count}</h5>
          )}
          <p className='text-[15px] text-webGray font-semibold'>Followers</p>
        </div>

        <div className='flex-1 py-4 px-[22px] flex flex-col gap-0.5 justify-center items-center border-l border-r border-onyxGrey'>
          {isLoading ? (
            <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
          ) : error ? (
            <h5 className='text-[19px] font-bold'>No data</h5>
          ) : (
            <h5 className='text-[19px] font-bold'>{data?.followed_count}</h5>
          )}
          <p className='text-[15px] text-webGray font-semibold'>Followings</p>
        </div>
        <div className='flex-1 py-4 px-2 flex flex-col gap-0.5 justify-center items-center'>
          {isLoading ? (
            <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
          ) : error ? (
            <h5 className='text-[19px] font-bold'>No data</h5>
          ) : (
            <h5 className='text-[19px] font-bold'>{data?.post_count}</h5>
          )}
          <p className='text-[15px] text-webGray font-semibold'>Posts</p>
        </div>
      </div>
      {isOwn ? (
        <Link href='/settings'>
          <Button icon={<IconGear />} variant='shadow'>
            Settings
          </Button>
        </Link>
      ) : (
        <div className='flex justify-center items-center gap-[10px]'>
          <div
            onClick={handleClick}
            className='cursor-pointer hover:opacity-80 transition-opacity bg-moonlessNight p-[12px] rounded-[8px]'
          >
            <IconChat />
          </div>

          <SubscribeButton type='text' userId={userId} />
        </div>
      )}
    </div>
  );
};

export default UserPanel;
