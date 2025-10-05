'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/UI/Popover/Popover';
import { SmileIcon } from 'lucide-react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className='size-11 flex items-center justify-center shrink-0'>
          <SmileIcon className='text-muted-foreground hover:text-foreground transition' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-full'>
        <Picker
          emojiSize={18}
          theme='light'
          data={data}
          maxFrequentRows={1}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  );
};
