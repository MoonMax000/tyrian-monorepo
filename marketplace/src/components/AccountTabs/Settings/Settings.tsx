'use client';
import Button from '@/components/UI/Button/Button';
import Paper from '@/components/UI/Paper';
import Toogle from '@/components/UI/Toogle';
import { FC, useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  is_active: boolean;
}

const initialSettings: NotificationSetting[] = [
  { id: 'new_subscribers', label: 'New subscribers', is_active: true },
  { id: 'content_updates', label: 'Update to purchased content', is_active: true },
  { id: 'comments_reviews', label: 'New comments / reviews', is_active: true },
  {
    id: 'subscription_expiration',
    label: 'Subscription expiration notifications',
    is_active: true,
  },
  { id: 'financial', label: 'Financial notifications (payments, charges)', is_active: true },
];

const Settings: FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);

  const toggleSetting = (id: string) => (newState: boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === id ? { ...setting, is_active: newState } : setting,
      ),
    );
  };

  return (
    <div>
      <Paper className='mb-6 pb-4'>
        <h2 className='text-h4 p-4 border-b-[1px] border-onyxGrey'>Notifications</h2>
        <div>
          {settings.map((el) => (
            <div
              key={el.id}
              className='flex mx-4 py-4 justify-between items-center border-b-[1px] border-onyxGrey last:border-b-0'
            >
              <p className='text-body-15'>{el.label}</p>
              <Toogle state={el.is_active} onChange={toggleSetting(el.id)} />
            </div>
          ))}
        </div>
        <Button className='cursor-not-allowed hover:text-webGray w-[180px] mx-auto'>
          Save Changes
        </Button>
      </Paper>

      <Paper className='mb-6 pb-4'>
        <h2 className='text-h4 p-4 border-b-[1px] border-onyxGrey'>Account&Security</h2>
        <div className='flex flex-col gap-6 py-6 border-b-[1px] border-onyxGrey'>
          <div className='flex px-4 justify-between items-center'>
            <div className='flex flex-col gap-1'>
              <p className='text-body-15'>Email</p>
              <span className='text-xs font-extrabold text-webGray'>
                You can update your email address
              </span>
            </div>
            <Button variant='gray' className='cursor-not-allowed hover:text-webGray w-[180px] '>
              Change Email
            </Button>
          </div>
          <div className='flex px-4 justify-between items-center'>
            <div className='flex flex-col gap-1'>
              <p className='text-body-15'>Password</p>
              <span className='text-xs font-extrabold text-webGray'>
                Increase your account’s security by choosing a stronger password.
              </span>
            </div>
            <Button variant='gray' className='cursor-not-allowed hover:text-webGray w-[180px] '>
              Change Password
            </Button>
          </div>
        </div>
        <div className='flex pt-6 px-4 justify-between items-center'>
          <p className='text-body-15'>Delete Profile from Marketplace</p>

          <Button variant='danger' className=' w-[180px]'>
            Delete
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default Settings;
