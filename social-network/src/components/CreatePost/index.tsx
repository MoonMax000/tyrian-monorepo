'use client';

import { useState, useCallback, useEffect, FC } from 'react';
import Avatar from '@/components/Avatar/Avatar';
import Button from '@/components/UI/Button/Button';
import { ChevronDown } from 'lucide-react';
import { ContextMenu, ContextMenuItem } from '@/components/UI/ContextMenu';
import Tag from '@/components/Tag';
import { TOPICS } from './contants';
import { Block, BlockType, Direction, Topic } from './types';
import ContentBlock from './ContentBlock';
import AddBlockButton from './AddBlockButton';
import { useCreatePostMutation } from '@/store/api';
import { TagInput } from '@/components/Post/components/TagInput';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import clsx from 'clsx';
import Checkbox from '@/components/UI/Checkbox/Checkbox';
import Input from '@/components/UI/TextInput';
import IconUSD from '@/assets/icons/icon-usd.svg';
import Loader from '@/components/UI/Loader';
import { TagType } from '../Tag/types';
import { ContentBlock as CurrentBlock } from '@/store/postsApi';
import { useGetUserByEmailQuery } from '@/store/authApi';
import { getMediaUrl } from '@/helpers/getMediaUrl';

interface Props {
  className?: string;
  classNameContent?: string;
  mode?: 'create' | 'edit';
  postId?: string;
  firstBlockId?: string;
  currentBlocks?: CurrentBlock[] | { id: string }[];
  userEmail?: string;
  initialData?: {
    title?: string;
    content?: string;
    topic?: Topic;
    blocks?: Block[];
    tags?: string[];
    isPaid?: boolean;
    payment?: number | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const PostEditor: FC<Props> = ({
  className,
  classNameContent,
  mode = 'create',
  initialData,
  onCancel,
  userEmail,
}) => {
  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    initialData?.topic?.value ?? null,
  );
  const [blocks, setBlocks] = useState<Block[]>(
    initialData?.blocks ?? [
      {
        id: generateId(),
        type: 'text',
        content: initialData?.content ?? '',
        order: 0,
      },
    ],
  );
  const { data: userData, isLoading: isUserLoading } = useGetUserByEmailQuery(userEmail ?? '');

  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(initialData?.isPaid ?? false);
  const [payment, setPayment] = useState<number | null>(initialData?.payment ?? null);

  const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
  const isLoading = isCreating;

  useEffect(() => {
    if (mode === 'create') {
      const savedDraft = localStorage.getItem('postDraft');
      if (savedDraft) {
        try {
          const { blocks, tags, title, selectedTopic } = JSON.parse(savedDraft);
          if (blocks) setBlocks(blocks);
          if (tags !== undefined) setTags(tags);
          if (title) setTitle(title);
          if (selectedTopic) setSelectedTopic(selectedTopic);
        } catch (err) {
          console.log('Ошибка при загрузке черновика:', err);
        }
      }
    }
  }, [mode]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleTopicSelect = (topicName: string) => {
    setSelectedTopic(topicName);
  };

  const handleConfirmBlock = (content: { file: File }, index: number) => {
    const detectFileCategory = (file: File): string => {
      const type = file.type;

      if (type.startsWith('image/')) return 'photo';
      if (type.startsWith('video/')) return 'video';
      if (type.startsWith('audio/')) return 'audio';
      if (
        type === 'application/pdf' ||
        type.includes('msword') ||
        type.includes('officedocument') ||
        type === 'text/plain' ||
        type === 'application/rtf'
      )
        return 'document';
      return 'unknown';
    };

    return {
      original_name: content.file.name,
      name: content.file.name,
      order: index,
      type: content && detectFileCategory(content.file || content),
      block_index: `${index}`,
    };
  };

  const handleCreatePost = async () => {
    const formData = new FormData();

    const filesContent = blocks
      .slice(1, blocks.length)
      .filter((block) => block.type === 'file' || block.type === 'audio')
      .map((block) => handleConfirmBlock(block.content, block.order));

    blocks
      .filter((block) => block.type !== 'text')
      .map((item) => formData.append('files', item.content.file));

    const contentBlocks = blocks.slice(1, blocks.length).map((block) => ({
      content:
        block.type === 'text' || block.type === 'h2' || block.type === 'h3'
          ? block.content
          : 'content',
      media_url: '',
      name: `${block.order}`,
    }));

    const postContent = {
      content: 'content',
      media_url: '',
      title: title,
      type: selectedTopic,
    };

    formData.append('post', JSON.stringify(postContent));
    formData.append('block', JSON.stringify({ blocks: contentBlocks }));
    formData.append('files_metadata', JSON.stringify({ files: filesContent }));

    await createPost(formData).then(() => onCancel?.());
  };

  const handleAddBlock = useCallback((type: BlockType) => {
    const newGeneratedBlock = {
      id: generateId(),
      type,
      content: type === 'file' || 'audio' ? null : '',
    };
    setBlocks((prevBlocks) => [
      ...prevBlocks,
      {
        ...newGeneratedBlock,
        order: prevBlocks.length,
      },
    ]);
  }, []);

  const handleBlockChange = (id: string, content: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (over && active.id !== over.id) {
      setBlocks((prevBlocks) => {
        const sortedBlocks = [...prevBlocks].sort((a, b) => a.order - b.order);
        const oldIndex = sortedBlocks.findIndex((block) => block.id === active.id);
        const newIndex = sortedBlocks.findIndex((block) => block.id === over.id);

        const newBlocksArray = arrayMove(sortedBlocks, oldIndex, newIndex);

        return newBlocksArray.map((block, index) => ({
          ...block,
          order: index,
        }));
      });
    }
  }, []);

  const handleMoveBlock = useCallback((id: string, direction: Direction) => {
    setBlocks((prevBlocks) => {
      const sortedBlocks = [...prevBlocks].sort((a, b) => a.order - b.order);
      const blockIndex = sortedBlocks.findIndex((block) => block.id === id);

      if (blockIndex === -1) return prevBlocks;

      if (
        (direction === 'up' && blockIndex === 0) ||
        (direction === 'down' && blockIndex === sortedBlocks.length - 1)
      ) {
        return prevBlocks;
      }

      const swapIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;

      const result = sortedBlocks.map((block, idx) => {
        if (idx === blockIndex) {
          return { ...block, order: swapIndex };
        } else if (idx === swapIndex) {
          return { ...block, order: blockIndex };
        }
        return block;
      });

      return result;
    });
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks((prevBlocks) => {
      if (prevBlocks.length <= 1) return prevBlocks;

      const filteredBlocks = prevBlocks.filter((block) => block.id !== id);

      return filteredBlocks
        .sort((a, b) => a.order - b.order)
        .map((block, index) => ({
          ...block,
          order: index,
        }));
    });
  }, []);

  const handleSaveDraft = () => {
    const draft = { blocks, tags, title, selectedTopic };
    localStorage.setItem('postDraft', JSON.stringify(draft));
  };

  const handleClearDraft = () => {
    localStorage.removeItem('postDraft');
    setTitle('');
    setSelectedTopic(null);
    setBlocks([
      {
        id: generateId(),
        type: 'text',
        content: '',
        order: 0,
      },
    ]);
    setTags([]);
  };

  const sortedBlocks = [...blocks]
    .filter((_, index) => index !== 0)
    .sort((a, b) => a.order - b.order);
  const blockIds = sortedBlocks.map((block) => block.id);

  return (
    <div className={clsx('w-[1060px] flex justify-between items-start', className)}>
      <div className={clsx('w-[672px]', classNameContent)}>
        <div className='flex-1'>
          <div className='flex flex-col justify-center gap-3 mb-4'>
            <div className='flex flex-row items-center gap-3'>
              {isUserLoading ? (
                <Loader className='w-12 h-12 rounded-full' />
              ) : (
                <Avatar
                  size='sm'
                  src={getMediaUrl(userData?.avatar ?? '') || '/mock-avatar-header.jpg'}
                  alt={userData?.username || 'User'}
                />
              )}

              <h4 className='text-[15px] font-bold'>{userData?.username || 'Unknown'}</h4>
            </div>
            <ContextMenu
              triggerType='lmb'
              menuClassName='bg-[#0B0E1180] backdrop-blur-[100px] border border-[#2E2744]'
              menuContent={
                <>
                  {TOPICS.map((topic) => (
                    <ContextMenuItem
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.value)}
                      icon={topic.icon}
                    >
                      {topic.name.toUpperCase()}
                    </ContextMenuItem>
                  ))}
                </>
              }
            >
              {selectedTopic ? (
                <Tag
                  className='max-w-[180px] h-[44px] flex justify-start items-center bg-transparent rounded-lg border border-regaliaPurple '
                  type={selectedTopic as TagType}
                />
              ) : (
                <div className='flex items-center gap-1 bg-[#0B0E1180] backdrop-blur-[100px] border border-[#2E2744] rounded-lg px-2 py-[10px] w-fit'>
                  <p className='text-sm text-[#fff] font-extrabold tracking-[0]'>Select Category</p>
                  <ChevronDown width={10} height={10} />
                </div>
              )}
            </ContextMenu>
          </div>

          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Title...'
            className={clsx(
              'w-full text-2xl font-bold bg-transparent text-secondary focus:outline-none focus:text-white mb-3.5',
              {
                'text-white': title.length > 0,
              },
            )}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext items={blockIds} strategy={verticalListSortingStrategy}>
              <div className='relative space-y-2'>
                {sortedBlocks.map((block, index) => (
                  <ContentBlock
                    key={block.id}
                    block={block}
                    onMove={handleMoveBlock}
                    onDelete={handleDeleteBlock}
                    onChange={handleBlockChange}
                    isFirst={index === 0}
                    isLast={index === sortedBlocks.length - 1}
                  />
                ))}
              </div>
            </SortableContext>
            <div className='mt-4'>
              <AddBlockButton onAdd={handleAddBlock} />
            </div>
          </DndContext>

          <div className='border-b-[1px] border-t-[1px] border-onyxGrey'>
            <TagInput value={tags} onChange={setTags} />
          </div>

          <div className='mt-12'>
            <h4 className='text-[19px] font-bold'>Monetization</h4>
            <div className='mt-9 flex items-center gap-6'>
              <div className='flex items-center gap-4'>
                <Checkbox checked={isPaid} onChange={() => setIsPaid(!isPaid)} />
                <p className='text-[15px] font-bold' onClick={() => setIsPaid(!isPaid)}>
                  Make this post paid
                </p>
              </div>
              <div className='w-[180px]'>
                <Input
                  placeholder='Enter amount'
                  icon={<IconUSD />}
                  type='number'
                  value={payment ?? ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setPayment(isNaN(val) ? null : val);
                  }}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-center mt-24 gap-2'>
            <Button variant='gradient' onClick={handleCreatePost} disabled={isLoading}>
              {isLoading
                ? mode === 'create'
                  ? 'Publishing...'
                  : 'Updating...'
                : mode === 'create'
                ? 'Publish'
                : 'Publish'}
            </Button>

            {mode === 'create' && (
              <>
                <Button variant='secondary' onClick={handleSaveDraft}>
                  Save Draft
                </Button>
                <Button variant='secondary' onClick={handleClearDraft}>
                  Clear
                </Button>
              </>
            )}

            {mode === 'edit' && onCancel && (
              <Button
                variant='secondary'
                className='border border-regaliaPurple'
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
