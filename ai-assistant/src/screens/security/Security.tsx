'use client';

import { FC, useEffect, useState } from 'react';
import {
  AccountActionCard,
  AccountSettingsCard,
  RecoveryCard,
  TwoFactorCard,
  UserSessions,
} from './cards';
import { AccountAction } from './cards/AccountActionCard';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/AuthService';

export const SecurityScreen: FC = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const { data: profile, isSuccess } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
  });

  const { mutateAsync: enable2fa } = useMutation({
    mutationKey: ['changeFieldsVerificationConfirm'],
    mutationFn: (isEnabled: boolean) =>
      AuthService.updateProfile({ is_2fa_enabled: isEnabled }),
  });

  const toggle2fa = (isEnabled: boolean) => {
    setIs2FAEnabled(isEnabled);
    enable2fa(isEnabled);
  };

  useEffect(() => {
    if (isSuccess && profile) {
      setIs2FAEnabled(profile.is_2fa_enabled);
    }
  }, [isSuccess, profile]);

  const accountActions: AccountAction[] = [
    {
      key: 'deactivate',
      title: 'Deactivate Account',
      description:
        'Temporarily hide your profile and pause notifications. You can reactivate at any time by logging in.',
      isActive: true,
    },
    {
      key: 'delete',
      title: 'Delete Account',
      description:
        'Permanently remove your profile and all related data. This action is irreversible.',
      isActive: false,
    },
  ];

  return (
    <section className='flex flex-col gap-6'>
      <AccountSettingsCard />
      <TwoFactorCard isEnabled={is2FAEnabled} onToggle={toggle2fa} />
      <RecoveryCard />
      <UserSessions />
      <AccountActionCard items={accountActions} />
    </section>
  );
};
