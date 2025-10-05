'use client';

import React from 'react';
import ScriptsList from './ScriptsList';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/UI/Tabs';
import IconNoContent from '@/assets/icons/icon-no-content.svg';
import VideoList from './VideoList';

const ScriptsScreenTabs = () => {
  return (
    <Tabs defaultValue='ideas' className='w-[712px]'>
      <TabsList className='flex border-b border-white border-opacity-10 space-x-4'>
        <TabsTrigger
          value='ideas'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Идеи
        </TabsTrigger>
        <TabsTrigger
          value='opinions'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Мнения
        </TabsTrigger>
        <TabsTrigger
          value='scripts'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Скрипты
        </TabsTrigger>
        <TabsTrigger
          value='video'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Видео
        </TabsTrigger>
        <TabsTrigger
          value='subscriptions'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Подписки
        </TabsTrigger>
        <TabsTrigger
          value='folowers'
          className='text-[17px] font-semibold px-4 py-1.5 border-b-4 border-transparent text-gray-500'
        >
          Подписчики
        </TabsTrigger>
      </TabsList>
      <TabsContent value='ideas'>
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
          <IconNoContent className='w-10 h-10' />
          <span>У пользователя нет опубликованных идей</span>
        </div>
      </TabsContent>
      <TabsContent value='opinions'>
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
          <IconNoContent className='w-10 h-10' />
          <span>У пользователя нет опубликованных идей</span>
        </div>
      </TabsContent>
      <TabsContent value='scripts'>
        <ScriptsList />
      </TabsContent>
      <TabsContent value='video'>
        <VideoList />
      </TabsContent>
      <TabsContent value='subscriptions'>
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
          <IconNoContent className='w-10 h-10' />
          <span>У пользователя нет опубликованных идей</span>
        </div>
      </TabsContent>
      <TabsContent value='folowers'>
        <div className='flex flex-col m-auto gap-2 mt-6 items-center opacity-50'>
          <IconNoContent className='w-10 h-10' />
          <span>У пользователя нет опубликованных идей</span>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ScriptsScreenTabs;
