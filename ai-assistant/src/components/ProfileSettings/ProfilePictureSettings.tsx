'use client';
import React, { FC, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/utilts/cn';
import Avatar from '../ui/Avatar/Avatar';
import ButtonWrapper from '../ui/ButtonWrapper/ButtonWrapper';
import UpdateCoverIcon from '@/assets/system-icons/updateCoverIcon.svg';
import UpdatePictureIcon from '@/assets/system-icons/updatePictureIcon.svg';
import ModalWrapper from '../ModalWrapper';
import ChangeProfilePictureCard from '@/components/modals/ChangeProfilePictures/ChangeProfilePictureCard';
import ChangeCoverPictureCard from '@/components/modals/ChangeProfilePictures/ChangeCoverPictureCard';
import { ProfileSettingsForm } from '@/screens/profileSettings/ProfileSettings';

type TModalsType = 'profilePicture' | 'coverPicture';

interface ProfilePictureSettingsProps {
  avatar: string | File;
  cover: string | File;
  onChange: <K extends keyof ProfileSettingsForm>(
    field: K,
    value: ProfileSettingsForm[K],
  ) => void;
}

const ProfilePictureSettings: FC<ProfilePictureSettingsProps> = ({
  avatar,
  cover,
  onChange,
}) => {
  const [modal, setModal] = useState<TModalsType | null>(null);

  const handleClose = () => setModal(null);

  const handleAvatarUpdate = (file: File) => {
    onChange('avatar', file);
    handleClose();
  };

  const handleCoverUpdate = (file: File) => {
    onChange('cover', file);
    handleClose();
  };

  return (
    <div
      className={cn(
        'relative h-48 w-full rounded-[24px] overflow-hidden flex items-start justify-between',
      )}
    >
      <div className='absolute w-full h-full z-[0]'>
        <Image
          src={typeof cover === 'string' ? cover : URL.createObjectURL(cover)}
          alt='banner'
          fill
          className='absolute w-full h-full z-[0] object-cover'
        />
        <div className='absolute w-full h-full z-[0] bg-gradient-to-t from-[rgba(0,0,0,0.64)] to-[rgba(102,102,102,0)] blur-sm'></div>
      </div>

      <div className='flex justify-between w-full my-4 mx-4'>
        <button
          className='relative group'
          aria-label='Change profile photo'
          onClick={() => setModal('profilePicture')}
        >
          <Avatar
            src={
              typeof avatar === 'string'
                ? avatar ?? '/mock-avatars/avatar-mock.jpg'
                : URL.createObjectURL(avatar)
            }
            fallback='AB'
            size='large'
            className='w-full h-full rounded-[16px] object-cover'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center bg-[#0000007A] rounded-[16px] opacity-0 group-hover:opacity-100 transition'>
            <UpdatePictureIcon className='w-8 h-8 mb-1 text-lighterAluminum' />
            <span className='text-lighterAluminum text-center font-bold text-[15px]'>
              Update
              <br />
              profile picture
            </span>
          </div>
        </button>
        {modal === 'profilePicture' && (
          <ModalWrapper onClose={handleClose}>
            <ChangeProfilePictureCard
              onClose={handleClose}
              onSave={handleAvatarUpdate}
            />
          </ModalWrapper>
        )}

        <ButtonWrapper
          className='h-[40px] gap-[8px] px-[16px] py-[10px]'
          onClick={() => setModal('coverPicture')}
        >
          <UpdateCoverIcon
            width={20}
            height={20}
            className={'text-lighterAluminum group-hover:text-white'}
          />
          <div className='text-[15px] font-bold'>Update cover</div>
        </ButtonWrapper>
        {modal === 'coverPicture' && (
          <ModalWrapper onClose={handleClose}>
            <ChangeCoverPictureCard
              onClose={handleClose}
              onSave={handleCoverUpdate}
            />
          </ModalWrapper>
        )}
      </div>
    </div>
  );
};

export default ProfilePictureSettings;
