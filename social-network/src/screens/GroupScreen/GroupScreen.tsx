'use client';
import React, { FC, useEffect, useState } from 'react';
import DropDownChatsNav from '@/components/chats/DropDownChatsNav';
import StartChatModal, { TChatsModal } from '@/components/chats/StartChatModal';
import { ExpandableChatHeader } from '@/components/UI/Chat/ExpandableChat';
import ModalWrapper from '@/components/UI/ModalWrapper';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronLeft, MoreHorizontal, Search } from 'lucide-react';
import { Info, Phone, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import ChatBottombar from '@/components/UI/Chat/ChatBottombar';
import { ChatMessageList } from '@/components/UI/Chat/ChatMessageList';
import { MessageData } from '@/components/UI/Chat/types';
import LeftBar from '@/components/UI/Chat/LeftBar';
import { useGetProfileMeQuery } from '@/store/api';
import { lastTime, sendChatMessage } from '@/store/slices/chatWebsocketSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { WsMessageData } from '@/utilts/websocket/chatWebsocket';
import Loader from '@/components/UI/Loader';
import { GetHistoryPrivate, useGetGroupByIdQuery, useGetHistoryPublicQuery } from '@/store/chatApi';
import { SingleMessage } from '@/components/UI/Chat/SingleMessage/SingleMessage';
import { useChatWebsocket } from '@/utilts/hooks/useChatWebsocket';
import DetailsMain from '@/components/UI/Chat/ChatDetails/DetailsMain';

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const GroupScreen: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState<TChatsModal | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { connections } = useAppSelector((state) => state.chatWebsocket);
  const { data: me } = useGetProfileMeQuery();
  const dispatch = useAppDispatch();

  const { data: chatHistory, isLoading: isChatHistoryLoading } = useGetHistoryPublicQuery({
    chatID: id,
    limit: 1000,
  });

  const { data: groupInfo } = useGetGroupByIdQuery(id);

  useChatWebsocket();

  const transformToMessageData = (history: GetHistoryPrivate[]): MessageData[] => {
    return history.map((item) => ({
      message: {
        id: item.id,
        text: item.message,
        timestamp: item.timestamp,
        isRead: true,
        sender: {
          id: item.sender,
          name: item.sender === me?.id ? me.username : 'Group Member',
          avatar: me?.avatar_url || '',
        },
      },
      sender: {
        id: item.sender,
        name: item.sender === me?.id ? me.username : 'Group Member',
        avatar: me?.avatar_url || '',
        isOnline: true,
      },
      messageVariant: item.sender === me?.id ? 'sent' : 'received',
    })) as MessageData[];
  };

  const transformWsMessageToMessageData = (wsMessages: WsMessageData[]): MessageData[] => {
    return wsMessages
      .filter(
        (message) =>
          (message?.type === 'MSG' && message?.data?.sender !== me?.id) ||
          message?.data?.sender === me?.id,
      )
      .map((message) => ({
        message: {
          id: message.data.id?.toString(),
          text: message.data.data,
          timestamp: message.data.timestamp,
          isRead: true,
          sender: {
            id: message.data.sender,
            name: message.data.sender === me?.id ? me?.username : 'Group Member',
            avatar: me?.avatar_url || '',
          },
        },
        sender: {
          id: message.data.sender,
          name: message.data.sender === me?.id ? me?.username : 'Group Member',
          avatar: me?.avatar_url || '',
          isOnline: false,
        },
        messageVariant: message.data.sender === me?.id ? 'sent' : 'received',
      }));
  };

  const allMessages = [
    ...(chatHistory ? transformToMessageData([...chatHistory].reverse()) : []),
    ...transformWsMessageToMessageData(connections[id]?.messages ?? []),
  ];

  useEffect(() => {
    if (id && connections[id]?.connectionStatus === 'connected') {
      lastTime(id);
    }
  }, [id, connections[id]?.connectionStatus]);

  const handleSendMessage = (mes: string) => {
    if (!mes) return;
    dispatch(sendChatMessage(id, mes, id, '', 100, '', false, []));
    lastTime(id);
  };

  return (
    <section className='w-full grid grid-cols-[auto_1fr_auto] bg-blackedGray rounded-2xl'>
      <LeftBar isCollapsed={true} />
      <div className='flex flex-col justify-between w-full min-w-[566px] h-full border-x-[1px] border-onyxGrey'>
        <ExpandableChatHeader>
          <div className='flex items-center'>
            <ChevronLeft
              className='cursor-pointer opacity-[48%]'
              onClick={() => {
                router.push('/chats');
              }}
            />
            <Avatar className='flex justify-center items-center mr-2 ml-4'>
              <AvatarImage
                className='w-10 h-10 object-cover rounded-full'
                src={
                  groupInfo?.avatar || !groupInfo?.avatar?.length
                    ? '/def-logo.png'
                    : groupInfo.avatar
                }
                width={6}
                height={6}
                alt='Group Avatar'
              />
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-semibold text-[15px]'>{groupInfo?.name ?? 'Group Chat'}</span>
              <span className='text-[13px] font-bold opacity-[48%]'>
                {groupInfo?.user_count ? groupInfo.user_count : '1'} members
              </span>
            </div>
          </div>

          <div className='flex'>
            <div className='flex gap-8 flex-row items-center relative'>
              <Search
                className='cursor-pointer'
                onClick={() => setIsSearchActive(!isSearchActive)}
              />
              <MoreHorizontal
                className='cursor-pointer relative'
                onClick={() => setIsOpenDropdown(!isOpenDropdown)}
              />
              {isOpenDropdown && (
                <DropDownChatsNav
                  onClick={(action) => {
                    setIsOpenDropdown(!isOpenDropdown);
                    setIsOpenModal(!isOpenModal);
                    setIsTypeModal(action);
                  }}
                />
              )}
            </div>
          </div>

          <ModalWrapper
            isOpen={isOpenModal}
            onClose={() => setIsOpenModal(!isOpenModal)}
            contentClassName='!pr-0 !overflow-hidden rounded-[8px]'
            className='!w-[468px]'
          >
            <StartChatModal onClose={() => setIsOpenModal(false)} type={isTypeModal} />
          </ModalWrapper>
        </ExpandableChatHeader>

        <ChatMessageList>
          {isChatHistoryLoading ? (
            <Loader className='size-52 mx-auto' />
          ) : (
            allMessages.map((message, index) => (
              <SingleMessage
                currentChatType='group'
                key={message.message.id ?? index}
                messageData={message as MessageData}
                index={index}
              />
            ))
          )}
        </ChatMessageList>

        <ChatBottombar
          sendMessage={handleSendMessage}
          onAfterSend={() => {}}
          disabled={connections[id]?.connectionStatus === 'connecting'}
        />
      </div>
      {groupInfo?.name && (
        <DetailsMain
          className='w-[344px]'
          chat={{
            id: id,
            userCount: groupInfo.user_count,
            name: groupInfo.name,
            avatar: groupInfo.avatar,
            description: groupInfo.description,
          }}
          type='group'
        />
      )}
    </section>
  );
};

export default GroupScreen;
