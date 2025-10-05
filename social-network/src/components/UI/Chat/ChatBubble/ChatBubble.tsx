import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';
import { ChatBubbleChildProps, ChatBubbleProps } from './types';

const ChatBubble = forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant = 'received', layout = 'default', children, ...props }, ref) => {
    const baseClasses = 'flex gap-2 items-end relative group';
    const variantClasses = {
      received: '',
      sent: 'self-end flex-row-reverse',
    };
    const layoutClasses = {
      default: '',
      ai: 'max-w-full w-full items-center',
    };

    const mergedClasses = twMerge(
      clsx(baseClasses, variantClasses[variant], layoutClasses[layout], className),
    );

    return (
      <div className={mergedClasses} ref={ref} {...props}>
        {Children.map(children, (child) => {
          if (isValidElement<ChatBubbleChildProps>(child)) {
            return cloneElement(child, {
              ...child.props,
              variant,
              layout,
            });
          }
          return child;
        })}
      </div>
    );
  },
);
ChatBubble.displayName = 'ChatBubble';

export default ChatBubble;
