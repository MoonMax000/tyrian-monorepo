'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Block, Direction } from './types';
import { ContextMenu, ContextMenuItem, ContextMenuSeparator } from '@/components/UI/ContextMenu';
import { MoveUp, MoveDown, Trash2, GripVertical, X } from 'lucide-react';
import CodeEditor from '@/components/UI/CodeEditor/CodeEditor';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FileUploader } from '@/components/Post/components/FileUploader';
import Image from '../UI/Image';
import { AudioInput } from '@/components/UI/AudioInput/AudioInput';

interface ContentBlockProps {
  block: Block;
  onMove: (id: string, direction: Direction) => void;
  onDelete: (id: string) => void;
  onChange: (id: string, content: any) => void;
  isFirst: boolean;
  isLast: boolean;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onMove,
  onDelete,
  onChange,
  isFirst,
  isLast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
    data: {
      type: 'block',
      block,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (typeof block.content === 'string' && block.content.trim().length > 0) {
      setShowControls(true);
    }
  }, [block.content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      textareaRef.current.selectionEnd = textareaRef.current.value.length;

      adjustTextareaHeight();
    }
  }, [isEditing]);

  const handleContentClick = () => {
    if (!isEditing && block.type !== 'code') {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(block.id, e.target.value);
    adjustTextareaHeight();
  };

  const handleCodeChange = (newCode: string) => {
    onChange(block.id, newCode);
  };

  const handleAudioAdd = (content: File) => {
    onChange(block.id, {
      file: content,
    });
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const renderEditableContent = () => {
    if (block.type === 'code') {
      return <CodeEditor textScript={block.content} onChange={handleCodeChange} />;
    }

    if (block.type === 'file') {
      const currentFile = block.type === 'file' ? block.content : null;

      return (
        <div className='flex flex-col gap-2'>
          <FileUploader value={currentFile} onChange={(newValue) => onChange(block.id, newValue)} />

          {/* <input
            type='text'
            placeholder='Or paste a link to your file (image or video)...'
            value={currentFile?.url || ''}
            onChange={(e) => {
              const url = e.target.value;
              onChange(
                block.id,
                JSON.stringify({
                  ...(currentFile || {}),
                  url,
                }),
              );
            }}
            className='border border-gray-500 rounded px-3 py-2 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple'
          /> */}
        </div>
      );
    }

    let className = 'w-full resize-none overflow-hidden outline-none bg-transparent';

    switch (block.type) {
      case 'h2':
        className += ' text-[32px] font-bold py-2';
        break;
      case 'h3':
        className += ' text-[24px] font-bold py-2';
        break;
      default: // text
        className += ' text-[15px] font-medium py-2';
        break;
    }

    return (
      <textarea
        ref={textareaRef}
        className={className}
        value={block.content ?? ''}
        onChange={handleInput}
        onBlur={handleBlur}
        rows={1}
      />
    );
  };

  const renderStaticContent = () => {
    if (block.type === 'code') {
      return <CodeEditor textScript={block.content} onChange={handleCodeChange} />;
    }

    if (block.type === 'file') {
      const currentFile = block.type === 'file' ? block.content : null;

      // здесь временное решение до подключения логики

      return (
        <div className='flex flex-col gap-2'>
          {typeof block.content === 'string' ? (
            <Image
              key={block.content}
              src={block.content}
              alt='post media'
              className='w-full h-[382px] object-cover rounded-md'
            />
          ) : (
            <FileUploader
              value={currentFile}
              onChange={(newValue) => onChange(block.id, newValue)}
            />
          )}
          {/* <input
            type='text'
            placeholder='Or paste a link to your file (image or video)...'
            value={currentFile?.url || ''}
            onChange={(e) => {
              const url = e.target.value;
              onChange(
                block.id,
                JSON.stringify({
                  ...(currentFile || {}),
                  url,
                }),
              );
            }}
            className='border border-onyxGrey rounded px-3 py-2 bg-transparent text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple'
          /> */}
        </div>
      );
    }

    if (block.type === 'audio') {
      return <AudioInput onFileSelect={handleAudioAdd} />;
    }

    let className = 'cursor-text w-full break-words';

    switch (block.type) {
      case 'h2':
        className += ' text-[32px] font-bold py-2';
        break;
      case 'h3':
        className += ' text-[24px] font-bold py-2';
        break;
      default: // text
        className += ' text-[15px] font-medium py-2';
        break;
    }

    return (
      <div className={className} onClick={handleContentClick}>
        {block.content || (
          <span className='text-secondary text-[19px] font-bold'>Enter text...</span>
        )}
      </div>
    );
  };

  return (
    <div ref={setNodeRef} style={style} className='relative flex items-start gap-3 py-1 group'>
      <div className='pt-2 flex gap-1'>
        <ContextMenu
          triggerType='rmb'
          menuContent={
            <>
              <ContextMenuItem
                onClick={() => onMove(block.id, 'up')}
                icon={<MoveUp size={16} />}
                disabled={isFirst}
              >
                MOVE UP
              </ContextMenuItem>
              <ContextMenuItem
                onClick={() => onMove(block.id, 'down')}
                icon={<MoveDown size={16} />}
                disabled={isLast}
              >
                MOVE DOWN
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={() => onDelete(block.id)}
                icon={<Trash2 size={16} />}
                danger
              >
                DELETE BLOCK
              </ContextMenuItem>
            </>
          }
        >
          <div className='cursor-grab active:cursor-grabbing' {...attributes} {...listeners}>
            <GripVertical size={24} className='text-gray-400 hover:text-white' />
          </div>
        </ContextMenu>
      </div>
      <div className='flex-1 w-[672px]'>
        {isEditing ? renderEditableContent() : renderStaticContent()}
      </div>
      <button
        onClick={() => onDelete(block.id)}
        className='absolute top-0 right-0 p-1 text-gray-400 hover:text-red-500 hidden group-hover:block'
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ContentBlock;
