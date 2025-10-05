import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/shadcnui/avatar';
import { Variant, Layout } from './types';

interface ChatBubbleAvatarProps {
  variant?: Variant;
  layout?: Layout;
  src?: string;
  fallback?: string;
  className?: string;
}

const ChatBubbleAvatar: FC<ChatBubbleAvatarProps> = ({ src, fallback, className }) => (
  <Avatar className={twMerge('self-start relative top-5', className)}>
    <AvatarImage className='object-cover' src={src} alt='Avatar' />
    <AvatarFallback>{fallback?.substring(0, 2).toUpperCase()}</AvatarFallback>
  </Avatar>
);

ChatBubbleAvatar.displayName = 'ChatBubbleAvatar';

export default ChatBubbleAvatar;
