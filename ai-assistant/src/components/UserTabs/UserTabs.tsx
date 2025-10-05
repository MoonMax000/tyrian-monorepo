'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import Post from '@/components/Post';
import mockPost from '../../components/Post/mock-bg.jpg';
import IdeaIcon from '@/assets/system-icons/idea.svg';
import OpininonIcon from '@/assets/system-icons/opinions.svg';
import AnalyticIcon from '@/assets/system-icons/analytic.svg';
import SoftwaresIcon from '@/assets/system-icons/softwares.svg';
import VideoIcon from '@/assets/system-icons/video.svg';
import LikeIcon from '@/assets/system-icons/like.svg';
import { FC } from 'react';
import { PostProps } from '../Post/Post';

const tabItems = [
  { value: 'ideas', label: 'Ideas', icon: IdeaIcon },
  { value: 'opinions', label: 'Opinions', icon: OpininonIcon },
  { value: 'analytics', label: 'Analytics', icon: AnalyticIcon },
  { value: 'softwares', label: 'Softwares', icon: SoftwaresIcon },
  { value: 'videos', label: 'Videos', icon: VideoIcon },
  { value: 'liked', label: 'Liked', icon: LikeIcon },
];

const postContent: PostProps = {
  fileType: 'photo',
  bgImg: mockPost.src,
  typeTag: 'ideas',
  created: 'January 31, 5:10 PM',
  title: 'AI Constructs Threaten Emerging Economies: A New Wave of Unemployment and Inequality',
  message:
    'In recent years, artificial intelligence (AI) has become an integral part of the global economy. However, its impact on emerging economies raises serious concerns. Automated systems and algorithms, designed to improve efficiency, are beginning to replace traditional jobs—leaving millions without a source of income. In regions already struggling with economic instability, the rise of AI only deepens existing issues of inequality and poverty.',
  files: [{ name: 'pgoto', type: 'photo', file_size: 569, url: mockPost.src }],
};

const UserTabs: FC<{ isOwn?: boolean }> = ({ isOwn = true }) => {
  return (
    <Tabs defaultValue='ideas'>
      <TabsList className='mb-4'>
        {tabItems.map(({ value, label, icon: Icon }) => (
          <TabsTrigger
            key={value}
            value={value}
            className='flex gap-1.5 items-center font-semibold py-1 border-b-4 border-transparent !px-0'
          >
            <Icon width={16} height={16} /> {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map(({ value }) => (
        <TabsContent key={value} value={value} className='flex flex-col gap-6'>
          {Array.from({ length: 20 }).map((_, index) => (
            <Post key={index} {...postContent} isOwn={isOwn} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default UserTabs;
