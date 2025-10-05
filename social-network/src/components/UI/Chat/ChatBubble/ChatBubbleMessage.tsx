import clsx from 'clsx';
import MessageLoading from '../MessageLoading';
import { twMerge } from 'tailwind-merge';
import { ChatBubbleMessageProps } from './types';
import { forwardRef } from 'react';

const ChatBubbleMessage = forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  (
    {
      className,
      variant = 'received',
      layout = 'default',
      isLoading = false,
      hasText = true,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      'py-3 px-[10px] text-sm rounded-xl break-words max-w-[calc(100%-80px)] whitespace-pre-wrap relative';

    const variantClasses = {
      received: 'text-secondary-foreground rounded-bl-none rounded-r-xl rounded-tl-xl',
      sent: 'text-primary-foreground rounded-br-none rounded-l-xl rounded-tr-xl',
    };

    const layoutClasses = {
      default: '',
      ai: 'border-t w-full rounded-none bg-transparent',
    };

    const hasTextClasses = {
      true: '',
      false: 'py-1 px-1',
    };

    const mergedClasses = twMerge(
      clsx(
        baseClasses,
        variantClasses[variant],
        layoutClasses[layout],
        hasTextClasses[String(hasText) as 'true' | 'false'],
        className,
      ),
    );

    return (
      <div className={mergedClasses} ref={ref} {...props}>
        {isLoading ? (
          <div className='flex items-center space-x-2 px-2 py-1'>
            <MessageLoading />
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    );
  },
);
ChatBubbleMessage.displayName = 'ChatBubbleMessage';

export default ChatBubbleMessage;
