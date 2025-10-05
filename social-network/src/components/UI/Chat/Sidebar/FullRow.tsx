'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/utilts/cn';
import { buttonVariants } from '@/components/shadcnui/button';
import { Avatar, AvatarImage } from '@/components/shadcnui/avatar';
import { Badge } from '@/components/shadcnui/badge';
import clsx from 'clsx';
import { RootState } from '@/store/store';
import { setSelectedChatId } from '@/store/slices/chatSlice';
import { ILastMessage } from '@/store/chatApi';
import { formatChatDate } from '@/utilts/date-format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { users } from '@/app/data';

interface FullRowProps {
  chatId: number | string;
  entityVariant: 'user' | 'group';
  isMock?: boolean;
  avatar?: string;
  name?: string;
  lastMessage?: ILastMessage;
  newMessagesCount?: number;
  isOwnLastMessage?: boolean;
}

const FullRow = ({
  chatId,
  entityVariant,
  avatar,
  name,
  lastMessage,
  isMock = true,
  newMessagesCount,
  isOwnLastMessage,
}: FullRowProps) => {
  const dispatch = useAppDispatch();

  const { chat, lastMessage: lastMessageMOCK } = useAppSelector((state: RootState) => {
    const {
      users,
      groups,
      messages,
      userRelationData,
      isChatShown,
      chatId: selectedChatId,
      chatType: selectedChatType,
    } = state.chat;

    if (entityVariant === 'user') {
      const user = users.find((u) => u.id === chatId);
      const relation = userRelationData.find((r) => r.user_id === user?.id);
      const lastMessageId = relation?.messages?.[0];
      const lastMessage = messages.find((m) => m.id === lastMessageId);
      const sender = users.find((u) => u.id === lastMessage?.user_id);
      return {
        chat: user,
        lastMessage,
        senderName: sender?.name || 'Unknown User',
        isChatShown,
        selectedChatId,
        selectedChatType,
      };
    }

    if (entityVariant === 'group') {
      const group = groups.find((g) => g.id === chatId);
      const lastMessageId = group?.messages?.[0];
      const lastMessage = messages.find((m) => m.id === lastMessageId);
      const sender = users.find((u) => u.id === lastMessage?.user_id);
      return {
        chat: group,
        lastMessage,
        senderName: sender?.name || 'Unknown User',
        isChatShown,
        selectedChatId,
        selectedChatType,
      };
    }

    return {
      chat: null,
      lastMessage: null,
      senderName: null,
      isChatShown,
      selectedChatId,
      selectedChatType,
    };
  });

  const getLastMessagePreview = () => {
    if (lastMessageMOCK && !lastMessageMOCK.isLoading && isMock) {
      if (entityVariant === 'group') {
        return users[Number(chatId)].name + ': ' + lastMessageMOCK.text;
      } else {
        return lastMessageMOCK.text;
      }
    }

    if (isOwnLastMessage && lastMessage) {
      return (
        <>
          <span className='text-purple'>You:</span>
          <span className='text-secondary'> {lastMessage.message}</span>
        </>
      );
    }

    if (lastMessage) {
      return name + ': ' + lastMessage.message;
    }

    if (entityVariant === 'group' && lastMessageMOCK) {
      return;
    }
  };

  const selectedChatId = useAppSelector((state: RootState) => state.chat.selectedChat);
  const isRowSelected = selectedChatId === chatId;

  const setSelectedChat = useCallback(() => {
    dispatch(setSelectedChatId(chatId));
  }, [dispatch, chatId]);

  const themeVariant = useMemo(() => (isRowSelected ? 'ghost' : 'secondary'), [isRowSelected]);

  if (!chat && isMock) return null;

  return (
    <Link
      href='#'
      onClick={(e) => {
        e.preventDefault();
        setSelectedChat();
      }}
      className={cn(
        buttonVariants({ variant: themeVariant }),
        themeVariant === 'secondary' &&
          'bg-transparent dark:bg-transparent dark:text-white dark:hover:bg-moonlessNight dark:hover:text-white',
        'justify-between h-auto px-6 w-full hover:bg-moonlessNight',
        isRowSelected && 'bg-[#181A20]',
      )}
    >
      <div className='flex items-center gap-[13px]'>
        <Avatar className='flex justify-center items-center h-[64px] w-[64px]'>
          <AvatarImage
            className='object-cover'
            src={chat?.avatar || avatar || '/avatar.jpeg'}
            alt={'avatar_' + chatId}
          />
        </Avatar>
        <div className='flex flex-col gap-1'>
          <span className='text-[15px] font-bold'>{chat?.name || name}</span>
          <div className='flex justify-between items-center w-full gap-2'>
            <div className='flex items-center gap-1 text-[15px] font-bold max-w-[847px] truncate'>
              {getLastMessagePreview()}
            </div>
            <div className='h-1 w-1 bg-secondary rounded-full'></div>
            <span className='text-xs text-secondary font-bold'>
              {lastMessageMOCK?.timestamp ?? formatChatDate(lastMessage?.timestamp) ?? '17:10'}
            </span>
          </div>
        </div>
      </div>
      {lastMessageMOCK && isMock && (
        <Badge
          className={clsx('font-bold text-xs text-white rounded-full', {
            'bg-primary': !chat?.isMuted,
            'bg-onyxGrey': chat?.isMuted,
          })}
        >
          55
        </Badge>
      )}

      {!!newMessagesCount && (
        <Badge
          className={clsx('font-bold text-xs text-white rounded-full', {
            'bg-primary': !chat?.isMuted,
            'bg-onyxGrey': chat?.isMuted,
          })}
        >
          {newMessagesCount}
        </Badge>
      )}
    </Link>
  );
};

export default FullRow;
