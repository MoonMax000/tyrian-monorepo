'use client';

import { KeyboardEventHandler, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';
import { useAppDispatch } from '@/store/hooks';
import { setSearchString, setSearchCategory } from '@/store/slices/searchSlice';
import Image from '@/components/UI/Image';
import { useGetPostSearchMutation, useGetUsersSearchMutation, isPost } from '@/store/api';
import { formatChatDate } from '@/utilts/date-format';
import Search from '../Search';
import NothingNew from '@/components/NothingNew';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import SerchPostEl from '@/components/UI/Search/SerchPostElement';
import SerchUserElement from '@/components/UI/Search/SearchUserElement';
import { SearchFilter } from './types';
import { useClickOutside } from '@/hooks/useClickOutside';

interface SearchBarProps {
  className?: string;
}

export const SearchBar = ({ className }: SearchBarProps) => {
  const [isTextInputShown, setTextInputShown] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<SearchFilter>('ideas');
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const [searchMutation, { data: searchResponse }] = useGetPostSearchMutation();
  const [searchUserMutation, { data: searchUsersResponse }] = useGetUsersSearchMutation();

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(dropdownRef, () => setTextInputShown(false));
  const handleSerchStringChange = (value: string) => {
    setTextInputShown(true);
    setSearch(value);
  };

  const handleSerchKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      push('/popular');
      dispatch(setSearchCategory(activeTab));
      dispatch(setSearchString(search));
      setSearch('');
      setTextInputShown(false);
      event.currentTarget.blur();
    }
  };

  const serchRequest = (filter: SearchFilter) => {
    if (!search) return;
    const map: Record<SearchFilter, () => void> = {
      ideas: () => searchMutation({ q: search, page: 1, page_size: 10, type: 'ideas' }),
      softs: () => searchMutation({ q: search, page: 1, page_size: 10, type: 'softwares' }),
      opinions: () => searchMutation({ q: search, page: 1, page_size: 10, type: 'opinions' }),
      analytics: () => searchMutation({ q: search, page: 1, page_size: 10, type: 'analytics' }),
      users: () => searchUserMutation({ q: search, page: 1, page_size: 10 }),
      '': () => {},
    };
    map[filter]?.();
  };

  useEffect(() => {
    serchRequest(activeTab);
  }, [search, activeTab]);

  const renderPosts = () =>
    searchResponse?.data?.length ? (
      searchResponse.data.map(
        (value) =>
          isPost(value) && (
            <SerchPostEl
              key={value.id}
              label={
                <Link href={`/user/${value.user_id}`} className='text-purple underline text-[13px]'>
                  {value.user_name}
                </Link>
              }
              onClick={() => push(`/post/${value.id}`)}
              title={value.title}
              date={formatChatDate(value.created)}
              icon={
                <Image
                  src={value.author_avatar || '/def-logo.png'}
                  alt='Logo'
                  className='p-0 size-11 rounded-full'
                />
              }
            />
          ),
      )
    ) : (
      <NothingNew />
    );

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      <Search
        onKeyDown={handleSerchKeyDown}
        className='w-[640px]'
        value={search}
        onChange={(value) => handleSerchStringChange(value)}
        onFocus={() => setTextInputShown(true)}
      />

      {isTextInputShown && search && (
        <div
          className='absolute bg-[#0C1014] mt-6 z-10 border border-regaliaPurple rounded-2xl overflow-hidden'
          onKeyDown={handleSerchKeyDown}
        >
          <Tabs defaultValue={activeTab} className='w-[640px]'>
            <TabsList className='flex border-b space-x-4'>
              {['ideas', 'softs', 'opinions', 'analytics', 'users'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  onClick={() => setActiveTab(tab as SearchFilter)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value='ideas' className='max-h-[456px] overflow-y-auto'>
              {renderPosts()}
            </TabsContent>
            <TabsContent value='softs'>{renderPosts()}</TabsContent>
            <TabsContent value='opinions'>{renderPosts()}</TabsContent>
            <TabsContent value='analytics'>{renderPosts()}</TabsContent>

            <TabsContent value='users' className='max-h-[456px] overflow-y-auto'>
              {searchUsersResponse?.data?.length ? (
                searchUsersResponse.data.map((value) => (
                  <SerchUserElement
                    key={value.id}
                    onClick={() => push(`/user/${value.id}`)}
                    title={value.username}
                    label={value.username}
                    icon={
                      <Image
                        src={value.avatar_url || '/def-logo.png'}
                        alt='Logo'
                        className='p-0 size-11 rounded-full'
                      />
                    }
                  />
                ))
              ) : (
                <NothingNew />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
