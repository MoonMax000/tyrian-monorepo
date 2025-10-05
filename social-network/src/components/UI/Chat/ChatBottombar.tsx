import { FileImage, Mic, Paperclip, PlusCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, KeyboardEvent, useRef, useState, useCallback } from 'react';
import { Button, buttonVariants } from '@/components/shadcnui/button';
import { cn } from '@/utilts/cn';
import { AnimatePresence, motion } from 'framer-motion';
import { EmojiPicker } from './EmojiPicker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/UI/Popover/Popover';
import { ChatInput } from './ChatInput';
import useChatStore from '@/utilts/hooks/useChatStore';
import { createImagePreview, isValidImage, retryImageLoad } from './utils/validateFile';

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

interface ChatBottombarProps {
  sendMessage: (arg: string) => void;
  onAfterSend?: () => void;
  disabled?: boolean;
}

const ChatBottombar = ({ sendMessage, onAfterSend, disabled }: ChatBottombarProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const addMessage = useChatStore((state) => state.addMessage);
  const messages = useChatStore((state) => state.messages);
  const hasInitialResponse = useChatStore((state) => state.hasInitialAIResponse);
  const setHasInitialResponse = useChatStore((state) => state.setHasInitialResponse);
  const [images, setImages] = useState<File[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean[]>([]);
  const [localMessage, setLocalMessage] = useState('');

  const { isMobile } = useChatStore((state) => state);

  const formattedTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    if (!hasInitialResponse) {
      setTimeout(() => {
        addMessage({
          id: messages.length + 1,
          user_id: 1,
          text: 'Awesome! I am just chilling outside.',
          timestamp: formattedTime,
        });
        setHasInitialResponse(true);
      }, 2500);
    }
  }, [addMessage, messages.length, hasInitialResponse, setHasInitialResponse]);

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setLocalMessage((prev) => prev + '\n');
    }
  };

  const handleSend = () => {
    if (disabled || !localMessage.trim()) return;
    sendMessage(localMessage);
    setImages([]);
    onAfterSend?.();
    setLocalMessage('');
  };

  return (
    <div className='pr-4 py-3 flex justify-between w-full items-center gap-2 border-t border-onyxGrey'>
      <AnimatePresence initial={false}>
        <motion.div
          key='input'
          className='w-full relative'
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: 'spring',
              bounce: 0.15,
            },
          }}
        >
          <div className='flex absolute bottom-[18px] left-[18px]'>
            <Popover open={false}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon' }),
                    'size-6',
                    'shrink-0',
                  )}
                >
                  <label htmlFor='plus-upload-input'>
                    <PlusCircle className='text-muted-foreground opacity-[48%] !size-auto cursor-pointer' />
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const validFiles = files.filter(isValidImage);

                      if (validFiles.length === 0) return;

                      const availableSlots = 10 - images.length;
                      const filesToAdd = validFiles.slice(0, availableSlots);

                      setImages((prev) => [...prev, ...filesToAdd]);
                      setLoadingImages((prev) => [...prev, ...filesToAdd.map(() => true)]);
                    }}
                    className='hidden'
                    id='plus-upload-input'
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent side='top' className='w-full p-2'>
                {localMessage.trim() || isMobile ? (
                  <div className='flex gap-2'>
                    <Link
                      href='#'
                      className={cn(
                        buttonVariants({ variant: 'ghost', size: 'icon' }),
                        'h-9 w-9',
                        'shrink-0',
                      )}
                    >
                      <Mic size={22} className='text-muted-foreground' />
                    </Link>
                    {BottombarIcons.map((icon, index) => {
                      if (icon.icon === FileImage) {
                        return (
                          <div key={index}>
                            <input
                              type='file'
                              accept='image/*'
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (!isValidImage(file)) {
                                  alert('Допустимы только изображения (не SVG) до 10MB');
                                  return;
                                }
                                console.log('Файл валиден:', file);
                              }}
                              className='hidden'
                              id='chat-file-input'
                            />
                            <label
                              htmlFor='chat-file-input'
                              className={cn(
                                buttonVariants({ variant: 'ghost', size: 'icon' }),
                                'h-9 w-9',
                                'shrink-0',
                                'cursor-pointer',
                                'flex items-center justify-center',
                              )}
                            >
                              <FileImage size={22} className='text-muted-foreground' />
                            </label>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={index}
                          href='#'
                          className={cn(
                            buttonVariants({ variant: 'ghost', size: 'icon' }),
                            'h-9 w-9',
                            'shrink-0',
                          )}
                        >
                          <icon.icon size={22} className='text-muted-foreground' />
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <Link
                    href='#'
                    className={cn(
                      buttonVariants({ variant: 'ghost', size: 'icon' }),
                      'h-9 w-9',
                      'shrink-0',
                    )}
                  >
                    <Mic size={22} className='text-muted-foreground' />
                  </Link>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {images.length > 0 && (
            <div className='flex flex-wrap gap-2 mb-3 px-2'>
              {images.map((img, i) => (
                <div
                  key={i}
                  className='relative w-20 h-20 border-transparent rounded-lg overflow-hidden'
                >
                  <>
                    {loadingImages[i] && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/40 z-10'>
                        <div className='w-6 h-6 border-4 border-purple border-t-transparent rounded-full animate-spin'></div>
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={createImagePreview(img)}
                      alt={`preview-${i}`}
                      className='object-cover w-full h-full'
                      onLoad={(e) => {
                        URL.revokeObjectURL(e.currentTarget.src);
                        setLoadingImages((prev) =>
                          prev.map((v, index) => (index === i ? false : v)),
                        );
                      }}
                      onError={(e) => retryImageLoad(e.currentTarget, img)}
                    />
                  </>
                  <button
                    type='button'
                    className='absolute top-0 right-0 bg-black bg-opacity-50 px-1'
                    onClick={() => setImages((prev) => prev.filter((_, index) => index !== i))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <ChatInput
            value={localMessage}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={({ target: { value } }) => setLocalMessage(value)}
            placeholder='Write a message...'
            className='rounded-lg pl-14 pr-32 py-5 !text-[15px] border-0'
          />
          <div className='absolute right-4 bottom-[8px] flex items-center gap-4'>
            <EmojiPicker
              onChange={(value) => {
                setLocalMessage((prev) => prev + value);
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
            />
            <Button
              className='size-11 shrink-0'
              onClick={handleSend}
              size='icon'
              disabled={disabled}
            >
              <Send className='text-muted-foreground !size-auto' />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ChatBottombar;
