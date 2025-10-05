import { FC } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import BaseInformation from '@/components/AccountTabs/BaseInformation';
import MyMaterials from '@/components/AccountTabs/MyMaterials';
import Subscriptions from '@/components/AccountTabs/Subscriptions';
import Settings from '@/components/AccountTabs/Settings';

export const metadata = {
  title: 'Profile',
  description: 'Profile',
};

const tabs = [
  { value: 'account', name: 'Account', content: <BaseInformation /> },
  { value: 'my_materials', name: 'My materials', content: <MyMaterials /> },
  { value: 'subscriptions', name: 'Subscriptions', content: <Subscriptions /> },
  { value: 'settings', name: 'Settings', content: <Settings /> },
];

const ProfileScreen: FC = () => {
  return (
    <section className='flex gap-1 mt-[34px]'>
      <div className=' max-w-[1080px] w-full flex flex-col gap-8 mx-auto'>
        <p className='text-[15px] font-bold'>
          <span className='text-webGray'>Main / </span>
          Account
        </p>
        <Tabs defaultValue='account'>
          <TabsList className='flex border-b-1 justify-between items-center mb-4'>
            <div className='flex items-center gap-4 '>
              {tabs.map((el) => {
                return (
                  <TabsTrigger
                    key={el.value}
                    value={el.value}
                    className='text-[19px] !font-medium py-1 border-b-4 border-transparent text-gray-500 !px-0'
                  >
                    {el.name}
                  </TabsTrigger>
                );
              })}
            </div>
          </TabsList>
          {tabs.map((el) => {
            return (
              <TabsContent key={el.value} value={el.value}>
                {el.content}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};
export default ProfileScreen;
