import { ArrowDown } from 'lucide-react';
import { Button } from '@/components/shadcnui/button';
import { useAutoScroll } from '@/utilts/hooks/useAutoScroll';
import { cn } from '@/utilts/cn';
import { FC, ReactNode } from 'react';
import { lastTime } from '@/store/slices/chatWebsocketSlice';
import { useParams } from 'next/navigation';


interface ChatMessageListProps {
  smooth?: boolean;
  className?: string;
  children: ReactNode;
}

export const ChatMessageList: FC<ChatMessageListProps> = ({
  className,
  children,
  smooth = false,
}) => {
  const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } = useAutoScroll({
    smooth,
    content: children,
  });
  const params = useParams<{ id: string }>();

  return (
    <div className='relative w-full max-h-[calc(100vh-235px)] flex-1 overflow-hidden  '>
      <div
        className={cn(
          'flex flex-col-reverse w-full h-full p-4 md:p-6 overflow-y-auto [color-scheme:dark]  scroll-smooth',
          className,
        )}
        ref={scrollRef}
        onWheel={disableAutoScroll}
        onTouchMove={disableAutoScroll}
      >
        <div className='flex flex-col gap-3 mt-auto'>{children}</div>
      </div>

      {!isAtBottom && (
        <Button
          onClick={() => {
            scrollToBottom();
            lastTime(`private_${params.id}`);
          }}
          size='icon'
          variant='outline'
          className={cn(
            'absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex rounded-full shadow-md bg-background/80 backdrop-blur-sm hover:bg-muted/80 z-10',
          )}
          aria-label='Scroll to bottom'
        >
          <ArrowDown className='h-4 w-4' />
        </Button>
      )}
    </div>
  );
};
