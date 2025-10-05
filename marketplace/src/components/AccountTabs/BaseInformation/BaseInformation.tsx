'use client';
import Paper from '@/components/UI/Paper';
import UserCard from '@/components/UserCard';
import StarIcon from '@/assets/icons/profile/star.svg';
import CaseIcon from '@/assets/icons/profile/case.svg';
import ProfileIcon from '@/assets/icons/profile/profile.svg';
import { FC } from 'react';
import ProcentLabel from '@/components/UI/ProcentLabel';

const MOCK_USER_CARD_DATA = {
  name: 'Jane Doe',
  followers: 85,
  traydingDays: 438,
  views_7d: 776,
  stability_index: '5.5/5.0',
};

const BaseInformation: FC = () => {
  const { name, followers, traydingDays, views_7d, stability_index } = MOCK_USER_CARD_DATA;
  return (
    <section className='grid grid-cols-[2fr,1fr] justify-between gap-6'>
      <div className='flex flex-col gap-6'>
        <UserCard
          name={name}
          followers={followers}
          traydingDays={traydingDays}
          views_7d={views_7d}
          stability_index={stability_index}
          role={'position_held'}
        />
        <div className='grid grid-cols-[1fr,1fr] gap-6'>
          <Paper className='p-4 flex items-center justify-between '>
            <div>
              <h3 className='text-[19px] font-bold mb-2'>Favorites</h3>
              <p className='text-[15px] text-webGray font-medium'>1,000 materials</p>
            </div>
            <StarIcon className='size-5' />
          </Paper>

          <Paper className='p-4 flex items-center justify-between'>
            <div>
              <h3 className='text-[19px] font-bold mb-2'>Subscriptions</h3>
              <p className='text-[15px] text-webGray font-medium'>100 following</p>
            </div>
            <ProfileIcon className='size-5' />
          </Paper>
        </div>
      </div>
      <div className='flex flex-col gap-6'>
        <Paper>
          <p className='px-4  pt-4 text-[19px] font-bold text-purple border-b-[1px] border-onyxGrey'>
            Statistics
          </p>
          <div>
            <div className='flex items-center justify-between p-4'>
              <p className='text-webGray text-[15px] font-bold'>Total Balance</p>
              <p className='text-[15px] font-bold'>$1,000,000,000.00</p>
            </div>
            <div className='flex items-center justify-between p-4'>
              <p className='text-webGray text-[15px] font-bold'>Today’s PnL</p>
              <ProcentLabel border={true} value={1.25} />
            </div>
          </div>
        </Paper>
        <Paper className='p-4 flex items-center justify-between'>
          <div>
            <h3 className='text-[19px] font-bold mb-2'>My materials</h3>
            <p className='text-[15px] text-webGray font-medium'>100 materials</p>
          </div>
          <CaseIcon className='size-5' />
        </Paper>
      </div>
    </section>
  );
};

export default BaseInformation;
