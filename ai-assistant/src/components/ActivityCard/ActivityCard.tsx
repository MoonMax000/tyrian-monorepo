import { FC, useState } from 'react';
import Paper from '../ui/Paper/Paper';
import { cn } from '@/utilts/cn';
import Button from '../ui/Button/Button';
import { LiveStreamsTab } from './LiveStreamsTab';
import { ChatsTab } from './ChatsTab';
import { GroupsTab } from './GroupsTab';

interface ActivityCardProps {
  className?: string;
}
type TabType = 'liveStreams' | 'chats' | 'groups';

const ActivityCard: FC<ActivityCardProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<TabType>('liveStreams');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'liveStreams':
        return <LiveStreamsTab />;
      case 'chats':
        return <ChatsTab />;
      case 'groups':
        return <GroupsTab />;
      default:
        return null;
    }
  };

  return (
    <Paper
      className={cn(
        className,
        'flex flex-col gap-3 p-4 rounded-[24px] border border-regaliaPurple backdrop-blur-[100px]',
      )}
    >
      <div className='flex justify-between items-center'>
        <span className='text-white text-[24px] font-bold'>Jane’s Activity</span>
        <div className='text-[15px] font-bold text-lightPurple'>Show all &gt;</div>
      </div>
      <div className='border-t border-regaliaPurple opacity-40'></div>
      <div className='flex flex-start gap-[12px]'>
        <Button ghost={activeTab !== 'liveStreams'} onClick={() => setActiveTab('liveStreams')}>
          Live Streams
        </Button>
        <Button ghost={activeTab !== 'chats'} onClick={() => setActiveTab('chats')}>
          Chats
        </Button>
        <Button ghost={activeTab !== 'groups'} onClick={() => setActiveTab('groups')}>
          Groups
        </Button>
      </div>
      {renderTabContent()}
    </Paper>
  );
};

export default ActivityCard;
