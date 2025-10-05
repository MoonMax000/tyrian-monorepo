import { memo, useCallback, useRef } from 'react';
import { MessageData } from '../types';
import { getMessageDateInfo } from '../СhatUtils';
import { useAppSelector } from '@/store/hooks';
import { useParams } from 'next/navigation';
import { getCurrentGroup } from './helpers';
import { MessageContent } from './MessageContent';
import { InviteMessage } from './InviteMessage';
import { useGetUserByIdQuery } from '@/store/api';

interface Props {
  messageData: MessageData;
  index: number;
  currentChatType: 'user' | 'group';
}
export const SingleMessage = memo(({ messageData, index, currentChatType }: Props) => {
  const { id: currentUserId } = useAppSelector((state) => state.user);
  const { groups } = useAppSelector((state) => state.chat);
  const { id: chatId } = useParams<{ id: string }>();

  const currentGroup = getCurrentGroup(chatId, currentChatType, groups);
  const isAINewsChannel = currentGroup?.id === 99;

  const { message, sender, messageVariant } = messageData;
  const { id, type = 'text', timestamp, inviteDetails, isRead } = message;
  const isCurrentUser = sender.id === currentUserId;

  const { data: userData } = useGetUserByIdQuery(sender?.id);

  const renderStateRef = useRef({
    lastMessageDate: null as string | null,
    unreadLabelShown: false,
  });

  const getDateInfo = useCallback(() => {
    const result = getMessageDateInfo(
      timestamp,
      isRead,
      isCurrentUser,
      id?.toString(),
      renderStateRef.current.lastMessageDate,
      renderStateRef.current.unreadLabelShown,
    );

    renderStateRef.current = {
      lastMessageDate: result.currentMessageDate,
      unreadLabelShown: (!isRead && !isCurrentUser) || renderStateRef.current.unreadLabelShown,
    };

    return result;
  }, [timestamp, isRead, isCurrentUser, id]);

  const { dateSeparatorNode, unreadSeparatorNode } = getDateInfo();
  const bubbleVariant = isAINewsChannel ? 'received' : (messageVariant as 'received' | 'sent');

  return type === 'invite' && inviteDetails ? (
    <InviteMessage
      id={id}
      dateSeparatorNode={dateSeparatorNode}
      unreadSeparatorNode={unreadSeparatorNode}
      index={index}
      inviteDetails={inviteDetails}
      sender={{
        ...sender,
        name: userData?.username ?? sender.name,
        avatar: userData?.avatar_url ?? sender.avatar,
      }}
      timestamp={timestamp}
    />
  ) : (
    <MessageContent
      id={id}
      dateSeparatorNode={dateSeparatorNode}
      unreadSeparatorNode={unreadSeparatorNode}
      index={index}
      bubbleVariant={bubbleVariant}
      isAINewsChannel={isAINewsChannel}
      messageVariant={messageVariant}
      isCurrentUser={isCurrentUser}
      currentChatType={currentChatType}
      sender={{
        ...sender,
        name: userData?.username ?? sender.name,
        avatar: userData?.avatar_url ?? sender.avatar,
      }}
      message={message}
    />
  );
});
SingleMessage.displayName = 'SingleMessage';
