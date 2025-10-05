'use client';

import CollapsedRow from '@/components/UI/Chat/Sidebar/CollapsedRow';
import FullRow from '@/components/UI/Chat/Sidebar/FullRow';
import { useGetChatListQuery } from '@/store/chatApi';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { lastTime } from '@/store/slices/chatWebsocketSlice';
import { setChats } from '@/store/slices/chatListSlice';

interface ChatList {
  isCollapsed: boolean;
  handleContextMenu?: (
    e: React.MouseEvent,
    entityId: number | string,
    type: 'chat' | 'channel',
  ) => void;
}

export default function ChatList({ handleContextMenu, isCollapsed }: ChatList) {
  const { data: chatListData, isSuccess } = useGetChatListQuery({});
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.user.id);

  const chats = useAppSelector((state) =>
    [...state.chatList.chats]
      .sort(
        (a, b) =>
          new Date(b.last_message?.timestamp || b.last_timestamp || 0).getTime() -
          new Date(a.last_message?.timestamp || a.last_timestamp || 0).getTime(),
      )
      .sort((a, b) => {
        const aIsSelf = a.type === 'private' && a.private_chat_contact_user_id === userId;
        const bIsSelf = b.type === 'private' && b.private_chat_contact_user_id === userId;
        return +aIsSelf - +bIsSelf;
      }),
  );

  const { push } = useRouter();

  const handleContextMenuClick = (
    e: React.MouseEvent,
    entityId: number | string,
    type: 'chat' | 'channel',
  ) => {
    if (handleContextMenu) {
      handleContextMenu(e, entityId, type);
    }
  };

  useEffect(() => {
    if (isSuccess && chatListData?.data) {
      dispatch(setChats(chatListData.data));
    }
  }, [isSuccess, chatListData, dispatch]);

  return (
    <nav className='grid gap-4 group-[[data-collapsed=true]]:justify-center'>
      {chats?.map((el) => (
        <div
          className='w-full cursor-pointer'
          key={`${el.id}_${el.user_id}_${el.created}_${Date.now()}_${Math.random()}`}
          onClick={() => {
            if (el.type === 'private') {
              const chatId = `private_${el.private_chat_contact_user_id}`;
              lastTime(chatId);
              push(`/chats/message/${el.private_chat_contact_user_id}`);
            } else if (el.type === 'groupchat') {
              lastTime(el.id);
              push(`/chats/group/${el.id}`);
            }
          }}
          onContextMenu={(e) => handleContextMenuClick(e, el.id, 'chat')}
        >
          {isCollapsed ? (
            <>
              <CollapsedRow
                isMock={false}
                chat={el}
                chatId={el.type === 'groupchat' ? el.id : el.private_chat_contact_user_id}
                entityVariant={el.type === 'groupchat' ? 'group' : 'user'}
              />
            </>
          ) : (
            <FullRow
              chatId={el.type === 'groupchat' ? el.id : el.private_chat_contact_user_id}
              entityVariant={el.type === 'groupchat' ? 'group' : 'user'}
              isMock={false}
              avatar={el.chat_avatar_url}
              name={el.name}
              lastMessage={el.last_message}
              newMessagesCount={el.new_messages_count}
              isOwnLastMessage={el.last_message?.sender === el.user_id}
            />
          )}
        </div>
      ))}
    </nav>
  );
}
