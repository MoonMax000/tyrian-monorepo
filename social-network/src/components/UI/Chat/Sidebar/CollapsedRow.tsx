'use client';

import { useCallback } from 'react';
import { RootState } from '@/store/store';
import { setSelectedChatId } from '@/store/slices/chatSlice';
import { cn } from '@/utilts/cn';
import { Avatar, AvatarImage } from '@/components/shadcnui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/shadcnui/tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ChatItem } from '@/store/chatApi';

interface CollapsedRowProps {
  chatId: number | string;
  entityVariant: 'user' | 'group';
  chat?: ChatItem;
  isMock?: boolean;
}

const CollapsedRow = ({ chatId, entityVariant, chat, isMock = true }: CollapsedRowProps) => {
  const dispatch = useAppDispatch();

  const mockChat = useAppSelector((state) => {
    if (entityVariant === 'user') {
      return state.chat.users.find((user) => user.id === chatId);
    } else {
      return state.chat.groups.find((group) => group.id === chatId);
    }
  });

  const selectedChatId = useAppSelector((state: RootState) => state.chat.selectedChat);

  const isRowSelected = selectedChatId === chatId;

  const avatarUrl = chat?.chat_avatar_url;

  const setSelectedChat = useCallback(
    () => dispatch(setSelectedChatId(chatId)),
    [dispatch, chatId],
  );

  if (!mockChat && !chat) return;

  return (
    <TooltipProvider key={chatId}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            className={cn('size-9 dark:text-muted-foreground dark:hover:text-white', 'relative')}
            onClick={setSelectedChat}
          >
            {!isMock && !!chat?.new_messages_count && (
              <div className='absolute z-10 -left-1 flex items-center justify-center bg-[#A06AFF] text-white rounded-[15px] w-[24px] h-[20px] px-[8px] py-[2px]'>
                <span className='text-xs font-medium leading-none'>{chat?.new_messages_count}</span>
              </div>
            )}
            {mockChat && (
              <div className='absolute z-10 -left-1 flex items-center justify-center bg-[#A06AFF] text-white rounded-[15px] w-[24px] h-[20px] px-[8px] py-[2px]'>
                <span className='text-xs font-medium leading-none'>55</span>
              </div>
            )}

            <Avatar className='flex justify-center items-center'>
              <AvatarImage
                className='object-cover'
                src={chat ? avatarUrl || '/avatar.jpeg' : mockChat?.avatar}
                alt={chat ? avatarUrl || '/avatar.jpeg' : mockChat?.avatar}
              />
            </Avatar>
            <span className='sr-only'>{mockChat?.name}</span>
            {isRowSelected && (
              <div className='absolute -left-[13px] top-1 rounded-r-[4px] w-1 h-12 bg-[#A06AFF]'></div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4 bg-[#272A32]'>
          {mockChat?.name || chat?.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CollapsedRow;
