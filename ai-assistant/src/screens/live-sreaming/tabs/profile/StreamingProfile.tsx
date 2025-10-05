'use client';
import { FC } from 'react';
import { DonationFromSubscribers } from './DonationFromSubscribers';
import KeyAnnStreamSettings from './KeyAnnStreamSettings';
import { UploadBanner } from './UploadBanner';
import { StreamingDescription } from './StreamingDescription';
import { StreamingStatsCards } from './StreamingStatsCards';
import { ProfileResponse } from '@/services/UserService';

interface Props {
  userData: ProfileResponse;
}
export const StreamingProfile: FC<Props> = ({ userData }) => {
  return (
    <div className='flex flex-col gap-6'>
      <StreamingStatsCards />
      <StreamingDescription initialDescription={userData?.description} />
      <UploadBanner cover_url={userData?.cover_url} />
      <DonationFromSubscribers />
      <KeyAnnStreamSettings />
    </div>
  );
};
