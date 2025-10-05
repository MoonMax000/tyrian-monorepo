'use client';
import { FC, useState } from 'react';
import Paper from '../UI/Paper';
import Image from 'next/image';
import { TRole } from '../UI/Tag/types';
import RoleTag from '../UI/Tag';
import PenIcon from '@/assets/icons/profile/pen.svg';
import ModalWrapper from '../UI/ModalWrapper';
import ProfileModal from '../ProfileModal';
interface Props {
  avatar?: string;
  name: string;
  followers: number;
  traydingDays: number;
  views_7d: number;
  role: TRole;
  stability_index: string;
}

const UserCard: FC<Props> = ({
  avatar,
  name,
  followers,
  traydingDays,
  views_7d,
  stability_index,
  role,
}) => {
  const [isOpenModal, setIsopenModal] = useState<boolean>(false);
  return (
    <Paper className='p-4 flex items-start justify-between'>
      <div className='flex gap-4 w-full'>
        <Image
          src={avatar ?? '/default/avatar.jpg'}
          width={122}
          height={122}
          alt='profileImage'
          className='rounded-2xl size-[122px]'
        />
        <div className='flex flex-col items-start justify-between'>
          <div>
            <h2 className='text-[31px] font-bold'>{name}</h2>
            <RoleTag className='uppercase' role={role} />
          </div>
          <div className='flex justify-start items-center'>
            <div className='pr-4 border-r-[1px] border-onyxGrey'>
              <p className='text-xs font-bold text-webGray mb-1'>FOLLOWERS</p>
              <p className='text-xs font-bold'>{followers}</p>
            </div>
            <div className='px-4 border-r-[1px] border-onyxGrey'>
              <p className='text-xs font-bold text-webGray mb-1'>TRADING DAYS</p>
              <p className='text-xs font-bold'>{traydingDays}</p>
            </div>
            <div className='px-4 border-r-[1px] border-onyxGrey'>
              <p className='text-xs font-bold text-webGray mb-1'>STABILITY INDEX</p>
              <p className='text-xs font-bold'>{stability_index}</p>
            </div>
            <div className='pl-4'>
              <p className='text-xs font-bold text-webGray mb-1'>VIEWS (7D)</p>
              <p className='text-xs font-bold'>{views_7d}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className='p-3 bg-onyxGrey rounded-lg cursor-pointer text-webGray'
        onClick={() => setIsopenModal(true)}
      >
        <PenIcon className='size-5' />
      </div>
      {isOpenModal && (
        <ModalWrapper
          onClose={() => setIsopenModal(false)}
          variant={'secondary'}
          className='w-[384px]'
        >
          <ProfileModal />
        </ModalWrapper>
      )}
    </Paper>
  );
};

export default UserCard;
