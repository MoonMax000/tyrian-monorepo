'use client';

import { useState, useMemo, useRef } from 'react';
import { cn } from '@/utilts/cn';
import EmptyState from '@/components/UI/Chat/Sidebar/EmptyState';
import ContextMenu from '@/components/UI/Chat/Sidebar/ContextMenu';
import { Plus, Pin } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import StartChatModal, { TChatsModal } from '@/components/chats/StartChatModal';
import { CreateFolderModal } from '@/components/chats/CreateFolderModal';
import { DeleteChatModal } from '@/components/chats/DeleteChatModal';
import MuteIcon from '@/assets/icons/chat/notifications-off-outline.svg';
import FolderIcon from '@/assets/icons/chat/folder-open.svg';
import ArchiveIcon from '@/assets/icons/chat/archive.svg';
import TrashIcon from '@/assets/icons/chat/trash.svg';
import Link from 'next/link';
import FullRow from '@/components/UI/Chat/Sidebar/FullRow';
import { TopBar } from '@/components/UI/Chat/Sidebar/TopBar';
import ModalWrapper from '@/components/UI/ModalWrapper';
import { DropdownMenuItem } from '@/components/UI/Chat/DropdownMenu';
import ChatTabs, { TabType } from '@/components/UI/Chat/ChatTabs';
import ChatList from '../Sidebar/ChatList';

interface Props {
  isCollapsed: boolean;
}

const ChatMain = ({ isCollapsed }: Props) => {
  const isChatShown = true;
  const groupsIds = [1, 2, 3];
  const usersIds = [4, 5, 6];

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState<TChatsModal | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isOpenFolderModal, setIsOpenFolderModal] = useState(false);
  const [deleteModalInfo, setDeleteModalInfo] = useState<{
    type: 'chat' | 'channel';
    entityId: number | string;
  } | null>(null);
  const [menuState, setMenuState] = useState<{
    x: number;
    y: number;
    items: DropdownMenuItem[];
    entityId: number | string;
    entityType: 'chat' | 'channel';
  } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(menuRef, () => setMenuState(null));

  const filteredGroupsIds = useMemo(() => groupsIds, [groupsIds]);
  const filteredUsersIds = useMemo(() => usersIds, [usersIds]);

  const hasChats = filteredGroupsIds.length > 0 || filteredUsersIds.length > 0;

  const handleOpenModal = (type: TChatsModal) => {
    setIsTypeModal(type);
    setIsOpenModal(true);
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    entityId: number | string,
    type: 'chat' | 'channel',
  ) => {
    e.preventDefault();
    const sidebarRect = (
      e.currentTarget.closest('[data-collapsed]') as HTMLElement
    )?.getBoundingClientRect();
    const x = e.clientX - (sidebarRect?.left ?? 0);
    const y = e.clientY - (sidebarRect?.top ?? 0);
    const items: DropdownMenuItem[] = [
      { name: 'Mute', icon: <MuteIcon />, onClick: () => console.log('Muted', entityId) },
      { name: 'Pin', icon: <Pin /> },
      {
        name: 'Add to a folder',
        icon: <FolderIcon />,
        subItems: [
          { name: 'All', icon: <FolderIcon /> },
          { name: 'Create a folder', icon: <Plus />, onClick: () => setIsOpenFolderModal(true) },
        ],
      },
      { name: 'Archive', icon: <ArchiveIcon /> },
      {
        name: type === 'channel' ? 'Leave Group' : 'Delete Chat',
        icon: <TrashIcon />,
        isDanger: true,
        onClick: () => {
          setDeleteModalInfo({ type, entityId });
        },
      },
    ];
    setMenuState({ x, y, items, entityId, entityType: type });
  };

  return (
    <div
      data-collapsed={isCollapsed}
      className={cn(
        'relative group flex flex-col h-full bg-onyxGray gap-4 data-[collapsed=true]:p-2',
        { 'border-r border-[#23252D]': isChatShown },
      )}
    >
      <TopBar
        isCollapsed={isCollapsed}
        isSearchActive={isSearchActive}
        setIsSearchActive={setIsSearchActive}
        handleOpenModal={handleOpenModal}
      />

      {isSearchActive ? (
        <div className='flex flex-col w-full'>
          <div className='bg-moonlessNight py-1 text-webGray text-[15px] font-bold flex justify-center'>
            Chats And Channels
          </div>
          <div className='py-2'>
            <FullRow chatId={1} entityVariant='user' key='user-1' />
          </div>
          <div className='bg-moonlessNight py-1 text-webGray text-[15px] font-bold flex justify-center'>
            Global Search
            <Link href={''} className='text-purple ml-2'>
              Show More
            </Link>
          </div>
          <div className='py-2'>
            {filteredGroupsIds.map((groupId) => (
              <FullRow chatId={groupId} entityVariant='group' key={`user-${groupId}`} />
            ))}
          </div>
          <div className='bg-moonlessNight py-1 text-webGray text-[15px] font-bold flex justify-center'>
            Messages
          </div>
          <div className='py-2'>
            {filteredUsersIds.map((userId) => (
              <FullRow chatId={userId} entityVariant='user' key={`user-${userId}`} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {!isCollapsed && <ChatTabs activeTab={activeTab} onTabChange={setActiveTab} />}
          <div className='h-full overflow-y-auto scrollbar'>
            <div className='h-full overflow-y-auto scrollbar'>
              {activeTab === 'archive' ? (
                <h2 className='text-white text-xl text-center font-semibold my-4 px-6'>
                  No archived chats yet
                </h2>
              ) : hasChats ? (
                <ChatList
                  isCollapsed={isCollapsed}
                  handleContextMenu={handleContextMenu}
                />
              ) : (
                !isCollapsed && <EmptyState handleOpenModal={handleOpenModal} />
              )}
            </div>
          </div>
        </>
      )}

      <ModalWrapper
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(!isOpenModal)}
        contentClassName='!pr-0 !overflow-hidden rounded-[8px]'
        className='!w-[468px]'
      >
        <StartChatModal type={isTypeModal} />
      </ModalWrapper>

      <ModalWrapper
        isOpen={isOpenFolderModal}
        onClose={() => setIsOpenFolderModal(!isOpenFolderModal)}
        contentClassName='!pr-0 !overflow-hidden rounded-[8px]'
        className='!w-[468px]'
      >
        <CreateFolderModal onClick={() => setIsOpenFolderModal(!isOpenFolderModal)} />
      </ModalWrapper>

      {deleteModalInfo && (
        <ModalWrapper
          isOpen={!!deleteModalInfo}
          contentClassName='!pr-0 !overflow-hidden rounded-[8px]'
          className='!w-[468px]'
        >
          <DeleteChatModal
            type={deleteModalInfo.type}
            onClick={() => {
              setDeleteModalInfo(null);
            }}
          />
        </ModalWrapper>
      )}

      <ContextMenu menuState={menuState} menuRef={menuRef} setMenuState={setMenuState} />
    </div>
  );
};

export default ChatMain;
