'use client';
import { useState } from 'react';
import { Bell, ChevronLeft, Pencil, PencilLine, Info, X } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/shadcnui/avatar';
import { Switch } from '@/components/shadcnui/switch';
import { users } from '@/app/data';
import Button from '@/components/UI/Button/Button';

import clsx from 'clsx';
import RighgtBarChatsTabs, { TabKey } from '../Tabs/RighgtBarChatsTabs';
import { useUpdateGroupInfoMutation } from '@/store/chatApi';

type ChatType = 'private' | 'group';
interface Chat {
  id: string | number;
  name: string;
  avatar: string;
  description?: string;
  userCount?: string;
}

interface DetailsMainProps {
  chat: Chat;
  className?: string;
  type?: ChatType;
}

const data: Record<TabKey, { title: string; text: string; icon: string }[] | typeof users> = {
  Members: [users[4], users[1]],
  Media: [],
  Files: [],
  Links: [
    {
      title: 'maps.goo.gl',
      text: 'Lorem ipsum dolor sit amet consectetur.\nIn elit accumsan amet leo sapien.',
      icon: 'M',
    },
    {
      title: 'rebrand',
      text: 'Lorem ipsum dolor sit amet consectetur.\nIn elit accumsan amet leo sapien.',
      icon: 'R',
    },
  ],
};

const DetailsMain = ({ chat, className, type = 'group' }: DetailsMainProps) => {
  const tabs: TabKey[] =
    type === 'group' ? ['Members', 'Media', 'Files', 'Links'] : ['Media', 'Files', 'Links'];
  const [activeTab, setActiveTab] = useState<TabKey>('Links');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(chat?.name || '');
  const [description, setDescription] = useState(chat.description || 'Welcome to the Future!');
  const [adminIds, setAdminIds] = useState<number[]>([]);

  const [updateInfo] = useUpdateGroupInfoMutation();

  const handleSaveChanges = () => {
    setIsEditing(false);
    updateInfo({
      chatId: String(chat.id),
      description: description,
      name: name,
    });
  };

  const toggleAdmin = (userId: number) =>
    setAdminIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId],
    );

  return (
    <div className={clsx('h-[calc(100vh-160px)] p-6 overflow-auto ', className)}>
      <div className='flex justify-between items-center'>
        {isEditing ? (
          <ChevronLeft className='cursor-pointer' onClick={() => setIsEditing(false)} />
        ) : (
          <X className='cursor-pointer' />
        )}
        {!isEditing && type === 'group' && (
          <Pencil size={20} className='cursor-pointer' onClick={() => setIsEditing(true)} />
        )}
      </div>
      <div className='flex flex-col items-center'>
        <Avatar className='size-24'>
          <AvatarImage
            className='object-cover'
            src={chat?.avatar || '/avatar.jpeg'}
            alt={chat.name}
          />
          {isEditing && (
            <div className='absolute inset-0 bg-black opacity-50 flex items-center justify-center rounded-full'>
              <PencilLine size={24} />
            </div>
          )}
        </Avatar>
        {isEditing ? (
          <>
            <input
              type='text'
              className='bg-transparent border border-onyxGrey rounded-xl px-6 py-4 mt-6 mb-6 text-white w-full text-[15px] focus:outline-none focus:border-[#A06AFF]'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className='bg-transparent border border-onyxGrey rounded-xl px-6 py-4 mb-6 text-white w-full text-[15px] focus:outline-none focus:border-[#A06AFF]'
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </>
        ) : (
          <>
            <div className='flex flex-col items-center mt-3'>
              <span className='font-medium text-2xl'>{name}</span>
              <span className='text-[15px] opacity-50'>
                {type === 'group'
                  ? `${chat.userCount} members, ${chat.userCount} online`
                  : 'Online'}
              </span>
            </div>
            <div className='w-full flex items-center py-4 my-8 px-6 border-[1.5px] border-onyxGrey border-opacity-10 rounded-xl text-[15px] text-webGray'>
              <Info className='mr-3' />
              <div>{description}</div>
            </div>
          </>
        )}
      </div>
      <div>
        <div className='flex items-center justify-between py-4 px-6 border-[1.5px] border-onyxGrey border-opacity-10 rounded-xl'>
          <div className='flex items-center'>
            <Bell size={20} />
            <span className='ml-2 text-xs'>Notifications</span>
          </div>
          <Switch className='data-[state=checked]:bg-[#A06AFF]' defaultChecked />
        </div>
        {isEditing && (
          <Button onClick={handleSaveChanges} className='mt-6 !rounded-xl'>
            Save Changes
          </Button>
        )}
        <RighgtBarChatsTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
          adminIds={adminIds}
          toggleAdmin={toggleAdmin}
        />
      </div>
    </div>
  );
};

export default DetailsMain;
