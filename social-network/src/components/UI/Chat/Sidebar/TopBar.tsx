'use client';

import { Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/shadcnui/button';
import CustomTooltip from './CustomTooltip';
import ChatIcon1 from '@/assets/icons/chat/icon1.svg';
import ChatIcon2 from '@/assets/icons/chat/icon2.svg';
import StartChatIcon from '@/assets/icons/chat/startChat.svg';
import CreateGroupIcon from '@/assets/icons/chat/createGroup.svg';
import NotificationIcon from '@/assets/icons/chat/notifications.svg';
import { TChatsModal } from '@/components/chats/StartChatModal';

interface TopBarProps {
  isCollapsed: boolean;
  isSearchActive?: boolean;
  setIsSearchActive?: (value: boolean) => void;
  handleOpenModal?: (type: TChatsModal) => void;
}

export const TopBar = ({
  isCollapsed,
  isSearchActive,
  setIsSearchActive,
  handleOpenModal,
}: TopBarProps) => {
  if (isCollapsed) {
    return (
      <div className='border-b border-b-onyxGrey flex flex-col items-center pt-4 pb-4'>
        <div className='grid place-items-center size-11'>
          <ChatIcon1 />
        </div>
        <div className='grid place-items-center size-12'>
          <ChatIcon2 />
        </div>
        <p className='text-xs'>All</p>
      </div>
    );
  }

  return (
    <div className='flex justify-between items-center mb-2 px-6 pt-6'>
      {isSearchActive && (
        <ChevronLeft
          className='cursor-pointer opacity-[48%] mr-[16px]'
          onClick={() => setIsSearchActive?.(false)}
        />
      )}
      <div className='w-full flex relative items-center pr-6'>
        <Search
          size={16}
          className='opacity-[48%] absolute left-4 flex items-center pointer-events-none'
        />
        <input
          placeholder='Search by people or chat names'
          onClick={() => setIsSearchActive?.(true)}
          className='w-full pl-10 pr-4 py-2 h-11 border-[1.5px] border-onyxGrey border-opacity-10 bg-[#0B0E11] rounded-lg focus:outline-none focus:border-[#A06AFF] text-xs caret-primary'
        />
      </div>
      <div className='flex gap-2'>
        <CustomTooltip content='Start a chat'>
          <Button
            variant='ghost'
            className='transition-all duration-300 p-[22px] hover:bg-moonlessNight'
            size='icon'
            onClick={() => handleOpenModal?.('chat')}
          >
            <StartChatIcon className='!size-6' />
          </Button>
        </CustomTooltip>
        <CustomTooltip content='Create a group'>
          <Button
            variant='ghost'
            className='transition-all duration-300 p-[22px] hover:bg-moonlessNight'
            size='icon'
            onClick={() => handleOpenModal?.('group')}
          >
            <CreateGroupIcon className='!size-6' />
          </Button>
        </CustomTooltip>
        <CustomTooltip content='Create a channel'>
          <Button
            variant='ghost'
            className='transition-all duration-300 p-[22px] hover:bg-moonlessNight'
            size='icon'
            onClick={() => handleOpenModal?.('server')}
          >
            <NotificationIcon className='!size-6' />
          </Button>
        </CustomTooltip>
      </div>
    </div>
  );
};
