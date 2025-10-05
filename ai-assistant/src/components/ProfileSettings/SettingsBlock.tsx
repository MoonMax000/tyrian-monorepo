'use client';
import React, { FC } from 'react';
import TickIcon from '@/assets/system-icons/tickIcon.svg';
import { Select } from '../ui/Select';
import Checkbox from '../ui/Checkbox/Checkbox';
import { Input } from '@/components/ui/Input';
import { ProfileSettingsForm } from '@/screens/profileSettings/ProfileSettings';
import { Sector, UserRole } from '@/services/AuthService';

interface Props {
  formData: ProfileSettingsForm;
  onChange: <K extends keyof ProfileSettingsForm>(
    field: K,
    value: ProfileSettingsForm[K],
  ) => void;
  roles: UserRole[];
  sectors: Sector[];
}

const SettingsBlock: FC<Props> = ({ formData, onChange, roles, sectors }) => {
const handleSectorChange = (sectorId: number, checked: boolean) => {
  const newSectors = checked
    ? formData.sectors.includes(sectorId)
      ? formData.sectors
      : [...formData.sectors, sectorId]
    : formData.sectors.filter((s) => s !== sectorId);
  onChange('sectors', newSectors);
};

  return (
    <div className='flex flex-col gap-[24px]'>
      <div className='flex w-full gap-[16px]'>
        <div className='flex-1 flex flex-col gap-[8px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            Display name
          </div>
          <Input
            value={formData.displayName}
            onChange={(e) => onChange('displayName', e.target.value)}
            className='rounded-[8px] bg-[#0C1014]/50 text-[15px] font-[500] backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition'
          />
        </div>
        <div className='flex-1 flex flex-col gap-[8px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            User name
          </div>
          <div className='relative w-full'>
            <Input
              value={formData.username}
              onChange={(e) => onChange('username', e.target.value)}
              className='rounded-[8px] bg-[#0C1014]/50 text-[15px] font-[500] backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition pr-10'
            />
            <TickIcon className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green' />
          </div>
        </div>
      </div>

      <div className='flex w-full gap-[16px]'>
        <div className='flex-1 flex flex-col gap-[8px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            Location
          </div>
          <Input
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            className='rounded-[8px] bg-[#0C1014]/50 text-[15px] font-[500] backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition'
          />
        </div>
        <div className='flex-1 flex flex-col gap-[8px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            Website / URL
          </div>
          <div className='relative w-full'>
            <Input
              value={formData.website}
              onChange={(e) => onChange('website', e.target.value)}
              className='rounded-[8px] bg-[#0C1014]/50 text-[15px] font-[500] backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition pr-10'
            />
          </div>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-[24px]'>
        <div className='flex-1 flex flex-col gap-[8px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            Role
          </div>
          <Select
            options={roles.map((r) => ({ label: r.name, value: r.name }))}
            value={formData.role}
            onChange={(option) => onChange('role', option.value as string)}
            placeholder='Select your role'
            className='h-[44px] bg-[#0C1014]/50 rounded-[8px] font-bold text-[15px] backdrop-blur-[100px] z-10'
          />
        </div>
        <div className='flex-1 flex flex-col gap-[16px]'>
          <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
            Sector
          </div>
          <div className='flex gap-[24px] mt-1'>
            {sectors.map((sector) => (
              <Checkbox
                key={sector.id}
                checked={formData.sectors.includes(sector.id)}
                onChange={(checked) => handleSectorChange(sector.id, checked)}
                label={sector.name}
                className='text-[15px]'
              />
            ))}
          </div>
        </div>
        <div></div>
      </div>

      <div className='flex-1 flex flex-col gap-[8px]'>
        <div className='text-lighterAluminum text-[12px] font-[700] uppercase'>
          bio
        </div>
        <textarea
          value={formData.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          rows={4}
          className='w-full min-h-[120px] px-[16px] py-[12px] rounded-[8px] bg-[#0C1014]/50 border border-regaliaPurple text-[15px] font-[400] backdrop-blur-[100px] outline-none focus:border-[#A189FC] transition z-0'
        />
      </div>
    </div>
  );
};

export default SettingsBlock;
