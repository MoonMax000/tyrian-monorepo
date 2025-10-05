'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import Label from '@/components/UI/Label/Label';
import Avatar from '@/components/Avatar/Avatar';
import Button from '@/components/UI/Button/Button';
import Input from '@/components/UI/Input/Input';
import Checkbox from '@/components/UI/Checkbox/Checkbox';
import Separator from '@/components/UI/Separator/Separator';
import { useGetProfileMeQuery, useUpdateAvatarMutation } from '@/store/api';
import PasswordChangeModal from '../PasswordChangeModal/PasswordChangeModal';

const ProfileSettings = () => {
  const [userName, setUserName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: profile, isLoading: isProfileLoading } = useGetProfileMeQuery();
  const [updateAvatar, { isLoading: isUpdatingAvatar }] = useUpdateAvatarMutation();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 10 МБ');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Поддерживаются только форматы JPEG, PNG или GIF');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      await updateAvatar(formData).unwrap();
    } catch (error) {
      console.log('Ошибка загрузки аватара:', error);
      alert('Произошла ошибка при загрузке файла');
    }
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  return (
    <>
      <div className='bg-blackedGray px-4 py-6 rounded-lg'>
        <h1 className='text-2xl font-bold'>Profile Information</h1>
        <p className='text-[15px] font-semibold pt-1 text-[#87888b]'>
          This information will be visible and accessible to all users
        </p>
        <div className='flex flex-col pt-6 gap-8'>
          <div className='flex items-center'>
            <Label>Avatar</Label>
            <div className='flex items-center gap-6 pl-6 flex-1'>
              <Avatar src={profile?.avatar_url} alt='User Avatar' />
              <span className='text-[13px] text-[#87888b]'>
                JPEG, PNG, or GIF, <br />
                max size: 10 MB.
              </span>
            </div>
            <div className='flex items-center gap-4'>
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/jpeg,image/png,image/gif'
                onChange={handleFileChange}
              />
              <Button onClick={handleUploadClick} disabled={isUpdatingAvatar}>
                {isUpdatingAvatar ? 'Uploading...' : 'Upload'}
              </Button>
              <Button variant='danger' disabled={isUpdatingAvatar}>
                Delete
              </Button>
            </div>
          </div>
          <div className='flex items-center'>
            <Label>User name</Label>
            <Input
              placeholder='User'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className='mx-4 flex-1'
            />
            <Button>Save</Button>
          </div>
          <div className='flex items-center gap-4'>
            <Label>Show online status</Label>
            <Checkbox checked={true} />
          </div>
          <Separator />
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <div className='flex items-center gap-2'>
                <Label>Email:</Label>
                <p className='font-semibold text-[15px]'>{profile?.email || 'loading...'}</p>
              </div>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                You can update your email address
              </span>
            </div>
            <Button>Change email</Button>
          </div>
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <Label>Password</Label>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                Increase your account's security by choosing a stronger password.
              </span>
            </div>
            <Button onClick={openPasswordModal}>Change password</Button>
          </div>
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <Label>Two-Factor Authentication</Label>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                Using a password and a code from your phone adds an extra layer of security.
              </span>
            </div>
            <Button>Enable 2FA</Button>
          </div>
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <Label>Phone number</Label>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                Add your mobile phone number
              </span>
            </div>
            <Button variant='secondary'>Add</Button>
          </div>
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <Label>Backup Email</Label>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                Add a backup email address
              </span>
            </div>
            <Button variant='secondary'>Add</Button>
          </div>
          <Separator />
          <div className='flex items-center'>
            <div className='flex flex-col gap-1 flex-1'>
              <Label>Delete Profile</Label>
              <span className='text-[13px] font-semibold text-[#87888b]'>
                Learn more about{' '}
                <Link href='#' className='text-primary underline'>
                  account deletion
                </Link>
              </span>
            </div>
            <Button variant='danger'>Delete</Button>
          </div>
        </div>
      </div>

      <PasswordChangeModal isOpen={isPasswordModalOpen} onClose={closePasswordModal} />
    </>
  );
};

export default ProfileSettings;
