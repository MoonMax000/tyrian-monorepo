'use client';

import React from 'react';
import { ContextMenu, ContextMenuItem } from '@/components/UI/ContextMenu';
import { BlockType } from './types';
import { AlignLeft, Heading2, Heading3, Image, Code, Plus, AudioLines } from 'lucide-react';
import { Button } from '@/components/UI/Button';

interface AddBlockButtonProps {
  onAdd: (type: BlockType) => void;
}

const AddBlockButton: React.FC<AddBlockButtonProps> = ({ onAdd }) => {
  return (
    <div className='my-4'>
      <ContextMenu
        triggerType='lmb'
        menuContent={
          <div className='border-[1px] border-[#2E2744] rounded-lg bg-[#0B0E1180] backdrop-blur-[100px]'>
            <ContextMenuItem onClick={() => onAdd('text')} icon={<AlignLeft size={16} />}>
              TEXT
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd('h2')} icon={<Heading2 size={16} />}>
              SUBHEADING H2
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd('h3')} icon={<Heading3 size={16} />}>
              SUBHEADING H3
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd('file')} icon={<Image size={16} />}>
              IMAGE OR VIDEO
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd('code')} icon={<Code size={16} />}>
              CODE
            </ContextMenuItem>
            <ContextMenuItem onClick={() => onAdd('audio')} icon={<AudioLines size={16} />}>
              AUDIO
            </ContextMenuItem>
          </div>
        }
      >
        <Button className='!p-0' variant='ghost' icon={<Plus />} />
      </ContextMenu>
    </div>
  );
};

export default AddBlockButton;
