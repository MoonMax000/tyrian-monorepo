import { FC } from 'react';
import { ChatBubbleActionProps } from './types';
import { Button } from '@/components/shadcnui/button';
import { twMerge } from 'tailwind-merge';

const ChatBubbleAction: FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = 'ghost',
  size = 'icon',
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={twMerge('rounded-full', className)}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
);
ChatBubbleAction.displayName = 'ChatBubbleAction';

export default ChatBubbleAction;
