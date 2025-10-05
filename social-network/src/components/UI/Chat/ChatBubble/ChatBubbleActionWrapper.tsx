import { forwardRef } from 'react';
import { ChatBubbleActionWrapperProps } from './types';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const ChatBubbleActionWrapper = forwardRef<HTMLDivElement, ChatBubbleActionWrapperProps>(
  ({ variant = 'received', className, children, ...props }, ref) => {
    const positionClasses =
      variant === 'sent'
        ? '-left-2 -translate-x-full flex-row-reverse'
        : ' translate-x-full flex-row-reverse right-[70px]';

    const mergedClasses = twMerge(
      clsx(
        'absolute top-1/2 -translate-y-1/2',
        'flex opacity-0 group-hover:opacity-100 transition-opacity duration-200',
        positionClasses,
        className,
      ),
    );

    return (
      <div className={mergedClasses} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);
ChatBubbleActionWrapper.displayName = 'ChatBubbleActionWrapper';

export default ChatBubbleActionWrapper;
