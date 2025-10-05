'use client';
import clsx from 'clsx';
import { users } from '@/app/data';
import UserMenuItem from '../../ChatDetails/UserMenuEl';
export type TabKey = 'Members' | 'Media' | 'Files' | 'Links';
interface TabData {
  title: string;
  text: string;
  icon: string;
}

interface TabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  data: Record<TabKey, TabData[] | typeof users>;
  adminIds: number[];
  toggleAdmin: (userId: number) => void;
  tabs: TabKey[];
}

const RighgtBarChatsTabs = ({
  activeTab,
  setActiveTab,
  data,
  adminIds,
  toggleAdmin,
  tabs,
}: TabsProps) => {
  return (
    <div className='mt-6 border-[1.5px] border-onyxGrey border-opacity-10 rounded-xl'>
      <div className='flex justify-center gap-5 border-b-[1.5px] border-onyxGrey border-opacity-10'>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              'cursor-pointer relative text-xs pb-3 pt-4 text-center',
              activeTab === tab ? 'text-white' : 'text-gray-400',
            )}
            aria-selected={activeTab === tab}
            role='tab'
          >
            {tab}
            {activeTab === tab && (
              <div className='absolute bottom-0 left-[-10%] right-[-10%] h-1 bg-[#A06AFF] rounded-t-xl' />
            )}
          </button>
        ))}
      </div>
      <div className='p-4'>
        {Array.isArray(data[activeTab]) && data[activeTab].length === 0 ? (
          <p className='text-gray-500 text-sm'>No attachments</p>
        ) : activeTab === 'Members' ? (
          (data[activeTab] as typeof users).map((user) => (
            <UserMenuItem key={user.id} user={user} adminIds={adminIds} toggleAdmin={toggleAdmin} />
          ))
        ) : (
          (data[activeTab] as TabData[]).map((item, idx) => (
            <div key={idx} className='flex gap-3 mb-4'>
              <div className='w-10 h-10 flex items-center justify-center bg-purple-700 rounded text-lg font-bold'>
                {item.icon}
              </div>
              <div>
                <div className='font-semibold text-sm'>{item.title}</div>
                <div className='text-sm text-gray-300 whitespace-pre-line'>{item.text}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RighgtBarChatsTabs;
