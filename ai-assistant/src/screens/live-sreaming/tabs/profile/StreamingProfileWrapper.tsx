import { FC } from 'react';
import { StreamerPermission } from '../../componets/StreamerPermission';
import { StreamingProfile } from './StreamingProfile';
import { ProfileResponse } from '@/services/UserService';

interface Props {
  userData: ProfileResponse;
}
export const StreamingProfileWrapper: FC<Props> = ({ userData }) => {
  const isStreamer =
    userData?.roles && userData?.roles?.indexOf('streamer') !== -1
      ? true
      : false;

  console.log('roles', userData.roles);
  return (
    <>
      {isStreamer ? (
        <StreamingProfile userData={userData} />
      ) : (
        <StreamerPermission />
      )}
    </>
  );
};
