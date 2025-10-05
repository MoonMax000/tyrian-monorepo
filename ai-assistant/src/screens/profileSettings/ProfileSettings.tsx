'use client';
import { FC, useEffect, useState } from 'react';
import ProfilePictureSettings from '@/components/ProfileSettings/ProfilePictureSettings';
import SettingsBlock from '@/components/ProfileSettings/SettingsBlock';
import Button from '@/components/ui/Button/Button';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { AuthService, UpdateProfilePayload } from '@/services/AuthService';
import { getMediaUrl } from '@/utilts/helpers/getMediaUrl';

export type ProfileSettingsForm = {
  avatar: string | File;
  cover: string | File;
  displayName: string;
  username: string;
  location: string;
  website: string;
  role: string;
  sectors: number[];
  bio: string;
};

const ProfileSettingsScreen: FC = () => {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
    initialData: () => queryClient.getQueryData(['getProfile']),
  });

  const { data: roles = [] } = useQuery({
    queryKey: ['getUserRoles'],
    queryFn: () => AuthService.getUserRoles(),
    initialData: () => queryClient.getQueryData(['getUserRoles']),
  });

    const { data: sectors = [] } = useQuery({
      queryKey: ['getSectors'],
      queryFn: () => AuthService.getSectors(),
      initialData: () => queryClient.getQueryData(['getSectors']),
    });

  const [formData, setFormData] = useState<ProfileSettingsForm | null>({
    avatar: '/mock-avatars/avatar-mock.jpg',
    cover: '/mock-avatars/background-image.png',
    displayName: 'Jane Doe',
    username: 'beautydoe',
    location: 'Amsterdam, Netherlands',
    website: 'https://example.com/beautydoe',
    role: 'Individual Investor',
    sectors: [],
    bio: `Hi, I’m Jane Doe. 
I’m a self-taught investor exploring markets with curiosity and discipline. I focus on long-term value, smart risk-taking, and staying calm when the market isn’t. Always learning, always adapting.`,
  });

  useEffect(() => {
    if (!profileData) return;
    setFormData({
      avatar: profileData.avatar
        ? getMediaUrl(profileData.avatar)
        : '/mock-avatars/avatar-mock.jpg',
      cover: profileData.background_image
        ? getMediaUrl(profileData.background_image)
        : '/mock-avatars/background-image.png',
      displayName: profileData.name ?? '',
      username: profileData.username ?? '',
      location: profileData.location ?? '',
      website: profileData.website ?? '',
      role: roles.find((r) => r.id === profileData.role)?.name ?? '',
      sectors: profileData.sectors ? profileData.sectors : [],
      bio: profileData.bio ?? '',
    });
  }, [profileData]);

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      AuthService.updateProfile(payload),
    onSuccess: () => {
      alert('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['getProfile'] });
    },
    onError: (err) => {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile.');
    },
  });

  const handleChange = <K extends keyof ProfileSettingsForm>(
    field: K,
    value: ProfileSettingsForm[K],
  ) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleReset = () => {
    if (!profileData) return;
    setFormData({
      avatar: profileData.avatar
        ? getMediaUrl(profileData.avatar)
        : '/mock-avatars/avatar-mock.jpg',
      cover: profileData.background_image
        ? getMediaUrl(profileData.background_image)
        : '/mock-avatars/background-image.png',
      displayName: profileData.name ?? '',
      username: profileData.username ?? '',
      location: profileData.location ?? '',
      website: profileData.website ?? '',
      role: roles.find(r => r.id === profileData.role)?.name ?? '',
      sectors: profileData.sectors ? profileData.sectors : [],
      bio: profileData.bio ?? '',
    });
  };

  const handleSave = () => {
    if (!formData) return;

    const payload: UpdateProfilePayload = {
      avatar: formData.avatar,
      background_image: formData.cover,
      name: formData.displayName,
      username: formData.username,
      location: formData.location,
      website: formData.website,
      role: roles.find(r => r.name === formData.role)?.id,
      sector: formData.sectors,
      bio: formData.bio,
    };

    updateProfileMutation.mutate(payload);
  };

  if (isLoading || !formData) {
    return <div>Loading profile...</div>;
  }

  return (
    <>
      <div className='flex flex-col gap-[24px] mt-[24px]'>
        <ProfilePictureSettings
          avatar={formData.avatar}
          cover={formData.cover}
          onChange={handleChange}
        />
        <SettingsBlock
          formData={formData}
          onChange={handleChange}
          roles={roles}
          sectors={sectors}
        />
      </div>

      <div className='flex justify-end gap-[16px] mt-[24px]'>
        <Button
          ghost
          className='w-[180px] h-[44px] backdrop-blur-[100px] py-[12px] px-[16px] text-white'
          onClick={handleReset}
          disabled={updateProfileMutation.isPending}
        >
          Reset
        </Button>
        <Button
          className='w-[180px] h-[44px] p-[10px]'
          onClick={handleSave}
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? 'Saving...' : 'Save changes'}
        </Button>
      </div>
    </>
  );
};

export default ProfileSettingsScreen;
