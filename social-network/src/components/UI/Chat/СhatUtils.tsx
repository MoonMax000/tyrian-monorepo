import { ReactNode } from 'react';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { Forward, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcnui/avatar';
import { ChatAttachmentRenderer } from './ChatAttachmentRenderer';
import { formatTimestamp } from '@/utilts/date-format';
import { markUpTags } from '@/utilts/markup';
import { cn } from '@/utilts/cn';
import { Button } from '@/components/shadcnui/button';
import { ForwardedMessage } from './ChatDetails/ForwardedMessage';

import { ActionIcon, Message, MessageDateInfo } from './types';
import { UnreadLabel } from './UnreadLabel';
import {
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from './ChatBubble';

export const actionIcons: ActionIcon[] = [
  { icon: Heart, type: 'Like' },
  { icon: Forward, type: 'Share' },
  { icon: DotsVerticalIcon, type: 'More' },
];

export const getMessageDateString = (timestamp: string | number | undefined): string | null => {
  if (!timestamp) return null;
  try {
    return new Date(timestamp).toDateString();
  } catch {
    return null;
  }
};

export const getMessageDateInfo = (
  timestamp: string | number | undefined,
  isRead: boolean | undefined,
  isCurrentUser: boolean,
  id: string,
  lastMessageDate: string | null,
  unreadLabelShown: boolean,
): MessageDateInfo => {
  const currentMessageDate = getMessageDateString(timestamp);
  const dateSeparatorNode: ReactNode = null;
  let unreadSeparatorNode: ReactNode = null;

  if (isRead === false && !isCurrentUser && !unreadLabelShown) {
    unreadSeparatorNode = <UnreadLabel key={`unread-${id}`} />;
  }

  return { currentMessageDate, dateSeparatorNode, unreadSeparatorNode };
};

export const renderAvatar = (
  sender: { avatar: string; name: string },
  isCurrentUser: boolean,
  currentChatType: 'group' | 'user' | null,
) => {
  if (currentChatType === 'group') {
    return isCurrentUser ? (
      <div className='flex-shrink-0 mr-4' aria-hidden='true'>
        <Avatar className='self-start relative top-0 size-10'>
          <AvatarImage className='object-cover' src={sender.avatar} alt='Avatar' />
          <AvatarFallback>{sender.name?.substring(0, 2)}</AvatarFallback>
        </Avatar>
      </div>
    ) : (
      <ChatBubbleAvatar src={sender.avatar} fallback={sender.name} className='mr-2' />
    );
  }
  return null;
};

export const renderActions = (
  isCurrentUser: boolean,
  forwarding: string | undefined,
  id: string,
  messageVariant: string,
) => {
  if (!isCurrentUser || forwarding) {
    return (
      <ChatBubbleActionWrapper
        variant={messageVariant as 'received' | 'sent'}
        className={isCurrentUser ? 'relative ml-auto mt-2' : ''}
      >
        {actionIcons.map(({ icon: Icon, type: actionType }) => (
          <ChatBubbleAction
            key={actionType}
            className='size-7'
            icon={<Icon className='size-4' />}
            onClick={() => console.log(`Action: ${actionType}, Msg ID: ${id}`)}
            aria-label={`${actionType} message ${id}`}
          />
        ))}
      </ChatBubbleActionWrapper>
    );
  }

  return (
    <div className='flex gap-1 mt-2 items-center self-start opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
      {actionIcons.map(({ icon: Icon, type: actionType }) => (
        <Button
          key={actionType}
          variant='ghost'
          className='p-2 bg-transparent hover:bg-[#3d3f44]'
          size='icon'
          onClick={() => console.log(`Action: ${actionType}, Msg ID: ${id}`)}
        >
          <Icon className='size-4 text-webGray' />
        </Button>
      ))}
    </div>
  );
};

export const renderMessageContent = (
  message: Message,
  messageVariant: string,
  isCurrentUser: boolean,
  currentChatType: 'group' | 'user' | null,
) => (
  <ChatBubbleMessage
    className={cn('min-w-0 ml-2 overflow-auto', isCurrentUser ? 'bg-[#2E2744]' : 'bg-[#23252D]')}
    isLoading={message.isLoading && !message.attachments}
    hasText={!!message.text || !!message.attachments || !!message.forwarding}
    variant={messageVariant as 'received' | 'sent'}
  >
    {message.timestamp && (
      <ChatBubbleTimestamp
        name={message.sender?.name}
        timestamp={formatTimestamp(message.timestamp) || `DEBUG:${message.timestamp}`}
        role={currentChatType === 'group' ? message.role : undefined}
        subscription={message.subscription}
        viewCount={currentChatType === 'group' ? message.viewCount : undefined}
        isCurrentUser={isCurrentUser}
        isMessageRead={message.isRead}
        className={cn(currentChatType === 'user' && 'justify-between')}
      />
    )}

    {message.text && (
      <div
        className={cn(
          'break-all flex flex-wrap bgcolor',
          (message.timestamp && !message.forwarding) || message.attachments ? 'mt-1' : '',
          message.viewCount !== undefined &&
            currentChatType === 'group' &&
            !isCurrentUser &&
            'pb-1',
        )}
      >
        {markUpTags(message.text)}
      </div>
    )}

    {message.forwarding && (
      <>
        <p className='text-[15px] text-webGray pb-1'>Forwarded messages</p>
        <ForwardedMessage id={Number(message.forwarding)} />
      </>
    )}

    {message.attachments && (
      <ChatAttachmentRenderer
        attachments={message.attachments as any}
        isLoading={message.attachmentsLoading}
      />
    )}
  </ChatBubbleMessage>
);
