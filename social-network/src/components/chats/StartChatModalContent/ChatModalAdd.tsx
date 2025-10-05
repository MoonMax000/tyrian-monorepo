import { Button } from '@/components/UI/Button';
import Checkbox from '@/components/UI/Checkbox/Checkbox';
import Search from '../../Header/components/Search';
import React, { useState } from 'react';
import Image from 'next/image';
import { chatApi, IUserChat, useCreateNewChatMutation, useGetUsersQuery } from '@/store/chatApi';
import { GroupInfo, TChatsModal } from '../StartChatModal';
import { useParams, useRouter } from 'next/navigation';
import { chatWebsocketService } from '@/utilts/websocket/chatWebsocket';
import { useAppDispatch } from '@/store/hooks';

export interface ExtendedUserChat extends IUserChat {
  isChecked: boolean;
}

interface Props {
  title: string;
  modalType: TChatsModal;
  groupInfo: GroupInfo | null;
  onClose?: (arg: boolean) => void;
}

export const ChatModalAdd = ({ title, modalType, groupInfo, onClose }: Props) => {
  const [valueSearch, setValueSearch] = useState('');
  const { id: chatId } = useParams<{ id: string }>();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const { push } = useRouter();
  const onChange = (value: string) => setValueSearch(value);
  const { data: usersData } = useGetUsersQuery(valueSearch ? { userName: valueSearch } : {});
  const [createChat] = useCreateNewChatMutation();
  const dispatch = useAppDispatch();

  const users: ExtendedUserChat[] = usersData
    ? usersData.map((user) => ({
        ...user,
        isChecked: selectedUserIds.includes(user.id),
      }))
    : [];

  const handleSubmit = () => {
    const selectedUser = users.find((user) => user.isChecked);
    if (modalType === 'chat') {
      push(`chats/message/${selectedUser?.id}`);
    }

    if (modalType === 'group') {
      createChat({
        type: 'groupchat',
        body: {
          name: groupInfo?.name ?? '',
          description: groupInfo?.description ?? '',
          user_list: {
            default: users.filter((user) => user.isChecked).map((filteredUser) => filteredUser.id),
          },
        },
      })
        .then(({ data }) => {
          push(`chats/group/${data?.message}`);
        })
        .catch((err) => console.error(err));
    }

    if (modalType === 'addChat') {
      if (selectedUser) {
        chatWebsocketService.AddUsers(chatId, 'add', selectedUserIds);
        dispatch(chatApi.util.invalidateTags(['getChatInfo']));
      }
      onClose?.(false);
    }
  };

  const handleCheckboxChange = (userId: string) => {
    if (modalType === 'group' || modalType === 'addChat') {
      setSelectedUserIds((prev) =>
        prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
      );
    } else {
      setSelectedUserIds([userId]);
    }
  };

  return (
    <div className='flex flex-col h-[504px] w-[468px] rounded-[8px] bg-blackedGray px-0 py-4'>
      <h2 className='text-white text-xl font-semibold text- mb-4 px-6'>{title}</h2>
      <div className='px-6'>
        <Search className='w-full mb-4 bg-moonlessNight' value={valueSearch} onChange={onChange} />
      </div>
      <div className='w-full h-[1px] bg-white opacity-[16%] mb-4'></div>
      <div className='flex flex-col overflow-y-auto pr-2'>
        <div className='flex flex-col overflow-y-auto scrollbar pr-2 flex-1'>
          {users.length > 0 ? (
            users.map((user, index) => (
              <div key={user.id || index} className='p-[12px_24px_12px_16px] flex items-center'>
                <div className='relative w-10 h-10 mr-4'>
                  <Image
                    src={user.avatar_url || '/avatar.jpeg'}
                    alt='photo'
                    className='w-10 h-10 rounded-full'
                    width={44}
                    height={44}
                  />
                </div>
                <div className='flex flex-col flex-1'>
                  <div className='flex gap-2 items-center'>
                    <span className='text-white'>{user.username || ''}</span>
                  </div>
                  <span className='text-white opacity-50'>Online</span>
                </div>
                <Checkbox
                  checked={user.isChecked}
                  onChange={() => handleCheckboxChange(user.id)}
                  className='rounded-full'
                />
              </div>
            ))
          ) : (
            <div className='text-center text-white opacity-60 py-4'>No users found</div>
          )}
        </div>
      </div>
      <div className='w-full h-[1px] bg-white opacity-[16%] my-4'></div>
      <div className='px-6'>
        <Button
          onClick={() => {
            handleSubmit();
          }}
          className='w-full bg-purple text-white font-semibold px-6 py-2 rounded-md'
          disabled={title !== 'New Group' ? !users.some((user) => user.isChecked) : false}
        >
          {modalType === 'chat' ? 'Start chat' : 'Invite'}
        </Button>
      </div>
    </div>
  );
};
