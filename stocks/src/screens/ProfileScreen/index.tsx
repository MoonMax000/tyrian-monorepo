'use client';
import Tabs from '@/components/Tabs';
import { TabModel } from '@/components/Tabs/Tab';
import Container from '@/components/UI/Container';
import { ReactNode, useState } from 'react';
import PersonalData from './components/Tabs/PersonalData';
import ChangePassword from './components/Tabs/ChangePassword';
import Feedback from './components/Tabs/Feedback';
import Subscribe from './components/Tabs/Subscribe';

const tabs: TabModel[] = [
  { key: 'personal_data', name: 'My Profile' },
  { key: 'change_password', name: 'Change Password' },
  { key: 'subscribe', name: 'Subscription' },
  { key: 'feedback', name: 'Feedback' },
];

const tabComponents: Record<
  'personal_data' | 'change_password' | 'subscribe' | 'feedback',
  ReactNode
> = {
  personal_data: <PersonalData />,
  change_password: <ChangePassword />,
  feedback: <Feedback />,
  subscribe: <Subscribe />,
};

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<TabModel>(tabs[0]);

  return (
    <Container className='min-h-screen'>
      <h3 className='text-h3 mb-6'>Settings</h3>
      <Tabs
        className='mb-6 !pb-[3px]'
        tabs={tabs}
        activeTabKey={activeTab.key}
        onClick={(tab) => setActiveTab(tab)}
      />

      <section></section>
      {tabComponents[activeTab.key as keyof typeof tabComponents]}
    </Container>
  );
};

export default ProfileScreen;
