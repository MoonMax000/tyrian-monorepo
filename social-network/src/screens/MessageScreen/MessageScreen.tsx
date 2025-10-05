'use client';
import React, { FC, useEffect, useState } from 'react';
import DropDownChatsNav from '@/components/chats/DropDownChatsNav';
import StartChatModal, { TChatsModal } from '@/components/chats/StartChatModal';
import { ExpandableChatHeader } from '@/components/UI/Chat/ExpandableChat';
import ModalWrapper from '@/components/UI/ModalWrapper';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { ChevronLeft, MoreHorizontal, Search, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Info, Phone, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import DetailsMain from '@/components/UI/Chat/ChatDetails/DetailsMain';
import ChatBottombar from '@/components/UI/Chat/ChatBottombar';
import { SingleMessage } from '@/components/UI/Chat/SingleMessage/SingleMessage';
import { MessageData } from '@/components/UI/Chat/types';
import { ChatMessageList } from '@/components/UI/Chat/ChatMessageList';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import LeftBar from '@/components/UI/Chat/LeftBar';
import { useGetProfileMeQuery, useGetUserByIdQuery } from '@/store/api';
import { GetHistoryPrivate, useGetHistoryPrivateQuery } from '@/store/chatApi';
import { lastTime, sendChatMessage } from '@/store/slices/chatWebsocketSlice';
import { WsMessageData } from '@/utilts/websocket/chatWebsocket';
import Loader from '@/components/UI/Loader';

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

const MessageScreen: FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState<TChatsModal | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const { id } = useParams<{ id: string }>();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { connections } = useAppSelector((state) => state.chatWebsocket);
  const { data: me } = useGetProfileMeQuery();
  const { data: companionData } = useGetUserByIdQuery(id ?? '', {
    skip: !id,
  });

  const { data: chatHistory, isLoading: isChatHistoryLoading } = useGetHistoryPrivateQuery(
    {
      limit: 10000,
      chat_with: id,
    },
    { skip: !id },
  );

  const handleSendMessage = (mes: string) => {
    if (!companionData || !mes || !me?.id) return;
    dispatch(sendChatMessage(`private_${me?.id}`, mes, companionData.id, '', 100, '', false, []));

    lastTime(`private_${companionData.id}`);
  };

  const transformToMessageData = (history: GetHistoryPrivate[]): MessageData[] => {
    return history.map((item) => ({
      message: {
        id: item.id,
        text: item.message,
        timestamp: item.timestamp,
        isRead: true,
        sender: {
          id: item.sender,
          name: item.sender === me?.id ? me.username : companionData?.username,
          avatar: companionData?.avatar_url || '',
        },
      },
      sender: {
        id: item.sender,
        name: item.sender === me?.id ? me.username : companionData?.username || '',
        avatar: companionData?.avatar_url || '',
        isOnline: true,
      },
      messageVariant: item.sender === me?.id ? 'sent' : 'received',
    })) as MessageData[];
  };

  const transformWsMessageToMessageData = (wsMessages: WsMessageData[]): MessageData[] => {
    return wsMessages
      .filter(
        (message) =>
          (message?.type === 'MSG' && message?.data?.sender === id) ||
          message?.data?.sender === me?.id,
      )
      .map((message) => ({
        message: {
          id: message.data.id.toString(),
          text: message.data.data,
          timestamp: message.data.timestamp,
          isRead: true,
          sender: {
            id: message.data.sender,
            name: message.data.sender === me?.id ? me.username : companionData?.username,
            avatar: companionData?.avatar_url ?? '',
          },
        },
        sender: {
          id: message.data.sender,
          name: message.data.sender === me?.id ? me.username : companionData?.username,
          avatar: companionData?.avatar_url ?? '',
          isOnline: false,
        },
        messageVariant: message.data.sender === me?.id ? 'sent' : 'received',
      }));
  };

  const allMessages = [
    ...(chatHistory ? transformToMessageData([...chatHistory].reverse()) : []),
    ...transformWsMessageToMessageData(connections[`private_${me?.id}`]?.messages ?? []),
  ];

  const uniqueMessages = allMessages.filter(
    (msg, index, self) => self.findIndex((m) => m.message.id === msg.message.id) === index,
  );

  useEffect(() => {
    console.log('12234', connections);
  }, [connections, id]);

  useEffect(() => {
    if (companionData?.id && connections[`private_${me?.id}`]?.connectionStatus === 'connected') {
      lastTime(`private_${companionData.id}`);
    }
  }, [companionData, connections, id, me?.id]);

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
                src={companionData?.avatar_url || '/avatar.jpeg'}
                width={6}
                height={6}
                alt={companionData?.avatar_url || '/avatar.jpeg'}
              />
            </Avatar>
            <div className='flex flex-col'>
              <span className='font-semibold text-[15px]'>{companionData?.username || ''}</span>
              <span className='text-[13px] font-bold opacity-[48%]'>
                {connections[`private_${id}`]?.connectionStatus === 'connecting'
                  ? 'Connecting'
                  : 'Online'}
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
            <StartChatModal type={isTypeModal} />
          </ModalWrapper>
        </ExpandableChatHeader>
        {isSearchActive && (
          <div className='flex gap-4 px-6 py-2 items-center border-b border-b-onyxGrey'>
            <div className='flex gap-2'>
              <ChevronUp className='cursor-pointer opacity-[48%]' />
              <ChevronDown className='cursor-pointer opacity-[48%]' />
            </div>
            <div className='w-full flex relative items-center'>
              <Search
                size={16}
                className='opacity-[48%] absolute left-3 flex items-center pointer-events-none'
              />
              <input
                placeholder='Search by people or message'
                className='w-full pl-10 px-4 py-2 border-[1.5px] border-onyxGrey border-opacity-10 bg-[#0a0a0a] rounded-lg focus:outline-none focus:border-[#A06AFF] text-xs caret-primary'
              />
            </div>
            <X className='cursor-pointer opacity-[48%]' onClick={() => setIsSearchActive(false)} />
          </div>
        )}

        <ChatMessageList>
          {isChatHistoryLoading ? (
            <Loader className='size-52 mx-auto' />
          ) : (
            uniqueMessages.map((message, index) => (
              <SingleMessage
                currentChatType='user'
                key={message.message.id}
                messageData={message as MessageData}
                index={index}
              />
            ))
          )}
        </ChatMessageList>

        <ChatBottombar
          sendMessage={handleSendMessage}
          onAfterSend={() => {}}
          disabled={connections[`private_${id}`]?.connectionStatus === 'connecting'}
        />
      </div>
      {companionData && (
        <DetailsMain
          className='w-[344px]'
          chat={{
            id: companionData.id,
            name: companionData.username,
            avatar: companionData.avatar_url,
          }}
          type='private'
        />
      )}
    </section>
  );
};

export default React.memo(MessageScreen);
