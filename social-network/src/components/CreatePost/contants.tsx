import IdeaIcon from '@/assets/icons/icon-idea.svg';
import ScriptIcon from '@/assets/icons/script.svg';
import VideoIcon from '@/assets/icons/video.svg';
import AnalyticsIcon from '@/assets/icons/analytics.svg';
import OpinionIcon from '@/assets/icons/opinion.svg';
import { Topic } from './types';

export const TOPICS: Topic[] = [
  { id: 1, name: 'idea', value: 'ideas', icon: <IdeaIcon /> },
  { id: 2, name: 'video', value: 'videos', icon: <VideoIcon /> },
  { id: 3, name: 'soft', value: 'softwares', icon: <ScriptIcon /> },
  { id: 4, name: 'analytics', value: 'analytics', icon: <AnalyticsIcon /> },
  { id: 5, name: 'opinion', value: 'opinions', icon: <OpinionIcon /> },
];
