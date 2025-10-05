import React, { useState } from 'react';
import IconGroup1 from '@/assets/icons/chat/photo-group (1).svg';
import IconGroup2 from '@/assets/icons/chat/photo-group (2).svg';
import IconGroup3 from '@/assets/icons/chat/photo-group (3).svg';
import IconGroup4 from '@/assets/icons/chat/photo-group (4).svg';
import IconGroup5 from '@/assets/icons/chat/photo-group (5).svg';
import IconGroup6 from '@/assets/icons/chat/photo-group (6).svg';
import IconPhoto from '@/assets/icons/icon-photo.svg';
import Input from '../../UI/TextInput';
import Select from '../../UI/Select';
import IconChevronDown from '@/assets/icons/icon-arrow.svg';
import SelectCounter from '../../UI/SelectCounter/SelectCounter';
import Button from '../../UI/Button/Button';
import { GroupInfo, TChatsModal } from '../StartChatModal';

interface Props {
  title: string;
  setVisible: (type: 'search' | 'hidden') => void;
  visible: 'search' | 'hidden';
  fromServer: boolean;
  setModalType: (type: TChatsModal) => void;
  setCreateStep: (arg: number) => void;
  setGroupInfo: (arg: GroupInfo) => void;
}

export const ChatModalGroup = ({
  title,
  setVisible,
  visible,
  fromServer = false,
  setModalType,
  setCreateStep,
  setGroupInfo,
}: Props) => {
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  return (
    <div className='flex flex-col rounded-[8px] bg-blackedGray h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden'>
      <h2 className='p-6 border-b border-onyxGrey text-white text-[24px] font-semibold mb-4'>
        {title}
      </h2>
      <div className='mx-auto mt-12 py-8 px-[46px] mb-7 flex flex-col items-center justify-center border-4 border-dashed rounded-full border-[#272A32]'>
        <IconPhoto className='w-8 h-8' />
        <span className='text-center'>Load</span>
      </div>
      <div className='mx-auto'>
        <span>Or choose:</span>
        <div className='flex items-center gap-1 mt-2'>
          <IconGroup1 />
          <IconGroup2 />
          <IconGroup3 />
          <IconGroup4 />
          <IconGroup5 />
          <IconGroup6 />
        </div>
      </div>
      <div className='w-full flex flex-col gap-4 p-6 pb-4'>
        <div className='flex flex-col gap-4'>
          <h3>Group Name</h3>
          <Input value={groupName} onChange={({ target }) => setGroupName(target.value)} />
        </div>
        <div className='flex flex-col gap-4'>
          <h3>Group Description</h3>
          <Input value={groupDesc} onChange={({ target }) => setGroupDesc(target.value)} />
        </div>
        <div className='flex flex-col gap-4'>
          <h3>Access Type</h3>
          <Select placeholder='Public' iconPosition='right' />
        </div>
        <div className='flex flex-col gap-4'>
          <h3>Monetization</h3>
          <div className='flex gap-[10px]'>
            <Select placeholder='Free' iconPosition='right' />
            <SelectCounter value={0} />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <h3>Visibility</h3>
          <div className='flex gap-[10px]'>
            <Button
              className='w-[205px]'
              variant='dark'
              isActive={visible === 'search'}
              onClick={() => setVisible('search')}
            >
              Visible in search
            </Button>
            <Button
              className='w-[205px]'
              variant='dark'
              isActive={visible === 'hidden'}
              onClick={() => setVisible('hidden')}
            >
              Hidden
            </Button>
          </div>
        </div>
      </div>
      <div className='flex w-full font-semibold text-[13px] p-6 pt-0 border-b border-onyxGrey'>
        <p className='text-webGray'>
          By creating a group, you agree to
          <a href='#' className='text-purple'>
            {' '}
            the terms of use.
          </a>
        </p>
      </div>
      <div className='p-6'>
        <Button
          onClick={() => {
            if (fromServer) {
              console.log('Создаю группу');
            } else {
              setModalType('group');
              setCreateStep(1);
              setGroupInfo({ name: groupName, description: groupDesc });
            }
          }}
          className='w-full bg-purple text-white font-semibold rounded-md'
        >
          {fromServer ? 'Создать' : 'Next'}
        </Button>
      </div>
    </div>
  );
};
