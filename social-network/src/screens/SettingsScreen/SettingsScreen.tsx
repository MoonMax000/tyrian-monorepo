import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';

import ProfileSettings from '@/screens/SettingsScreen/components/ProfileSettings/ProfileSettings';
import NotificationsSettings from '@/screens/SettingsScreen/components/NotificationsSettings/NotificationsSettings';
import SecuritySettings from '@/screens/SettingsScreen/components/SecuritySettings/SecuritySettings';
import UserPanel from '@/components/UserPanel';
import RecommendedList from '@/components/Recommended/RecommendedList';
import { recommendedData } from '@/components/Recommended/constatnts';

const SettingsScreen = () => {
  return (
    <div className='flex gap-6'>
      <Tabs defaultValue='profile' className='w-[712px]'>
        <TabsList className='mb-6'>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        <TabsContent value='profile'>
          <ProfileSettings />
        </TabsContent>
        <TabsContent value='notifications'>
          <NotificationsSettings />
        </TabsContent>
        <TabsContent value='security'>
          <SecuritySettings />
        </TabsContent>
      </Tabs>
      <div className='flex flex-col gap-6 w-[344px]'>
        <UserPanel />
        <RecommendedList RecommendedList={recommendedData} />
      </div>
    </div>
  );
};

export default SettingsScreen;
