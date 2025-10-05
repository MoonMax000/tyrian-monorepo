import { FC, useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import CameraIcon from '@/assets/icons/profile/camera.svg';
import Input from '../UI/Input';
import Button from '../UI/Button/Button';

const ProfileModal: FC = () => {
  const [avatar, setAvatar] = useState<string>('/default/avatar.jpg');
  const [name, setName] = useState<string>('Jane Doe');
  const [position, setPosition] = useState<string>('Position held');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log({ name, position, avatar });
  };

  return (
    <>
      <h2 className='p-6 pb-4 text-2xl'>Profile Info</h2>
      <div className='py-4 px-6 flex flex-col gap-4 items-center justify-between border-y-[1px] border-onyxGrey'>
        <div className='relative size-[122px] cursor-pointer' onClick={handleAvatarClick}>
          <Image
            src={avatar}
            width={122}
            height={122}
            alt='avatar'
            className='size-[122px] rounded-2xl object-cover'
          />
          <div className='absolute top-0 size-[122px] rounded-2xl bg-[#000000A3] hover:bg-[#000000CC] transition-colors'>
            <div className='h-full flex flex-col items-center justify-center gap-2'>
              <CameraIcon className='size-8 text-webGray' />
              <p className='text-[15px] font-bold'>Change</p>
            </div>
          </div>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            accept='image/*'
            className='hidden'
          />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <span className='text-xs font-bold'>Name</span>
          <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <span className='text-xs font-bold'>Position held</span>
          <Input
            placeholder='position'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
      </div>
      <div className='px-6 py-4'>
        <Button className='w-full' onClick={handleSave}>
          Save
        </Button>
      </div>
    </>
  );
};

export default ProfileModal;
