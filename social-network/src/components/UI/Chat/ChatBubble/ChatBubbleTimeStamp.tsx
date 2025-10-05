import Checked from '@/assets/icons/checkmark-done-outline.svg';
import { ChatBubbleTimestampProps } from './types';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Eye } from 'lucide-react';

const ChatBubbleTimestamp: FC<ChatBubbleTimestampProps> = ({
  name,
  timestamp,
  role,
  subscription,
  viewCount,
  isCurrentUser,
  className,
  isMessageRead,
  ...props
}) => {
  const displayName = isCurrentUser && name && !name.includes('(Me)') ? `${name} (Me)` : name;

  return (
    <div className={twMerge('mb-[2px] w-full flex items-center gap-2', className)} {...props}>
      <div className='flex items-center gap-2'>
        {displayName && <span className='text-[15px] text-primary font-medium'>{displayName}</span>}
        {(role || subscription) && (
          <span className='text-xs text-secondary font-extrabold'>{role || subscription}</span>
        )}
      </div>
      <div className='flex items-center'>
        {viewCount !== undefined && (
          <div className='text-xs text-secondary font-extrabold flex items-center gap-1'>
            <Eye size={14} />
            <span>{viewCount}</span>
          </div>
        )}
      </div>
      <div className='flex'>
        {isCurrentUser && isMessageRead && <Checked />}
        <span className='text-xs text-secondary font-extrabold'>{timestamp}</span>
      </div>
    </div>
  );
};
ChatBubbleTimestamp.displayName = 'ChatBubbleTimestamp';

export default ChatBubbleTimestamp;
