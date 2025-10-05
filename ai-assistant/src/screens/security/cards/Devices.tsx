import { FC, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import { Select } from '@/components/ui/Select';
import { Option } from '@/components/ui/Select/types';

const Options: Option[] = [{ value: 'main_account', label: 'Main account' }];
const headers = ['APPLICATION NAME', 'PERMISSIONS', 'AUTHORIZATION DATE', 'ACTION'];

const rows = [
  {
    applicationName: 'Finnandy',
    permissions: 'Fast API',
    authorizationDate: '13.06.25 at 12:49:30',
    action: 'Remove',
  },
  {
    applicationName: 'TradingView',
    permissions: 'Trade, Read',
    authorizationDate: '8.06.25 at 18:57:54',
    action: 'Remove',
  },
];

export const Devices: FC = () => {
  const [deviceOption, setDeviceOption] = useState<Option>(Options[0]);
  return (
    <Paper className='p-4'>
      <div className='flex flex-col justify-start items-start border-b border-b-regaliaPurple pb-1'>
        <h2 className='text-2xl font-bold '>Third-party Authorization</h2>
        <span className='text-[15px] font-normal '>
          Manage the third-party apps you’ve authorized to access your account. Ensure each app is
          safe - if not, revoke the authorization. You can reauthorize access to resume use.
        </span>
      </div>
      <div className='pt-4 flex flex-col gap-6'>
        <Select
          className='w-[180px]'
          options={Options}
          onChange={setDeviceOption}
          value={deviceOption.value}
        />
        <div className='w-full flex flex-col gap-4'>
          <div className='grid grid-cols-4 gap-4 text-xs uppercase font-semibold text-lighterAluminum'>
            {headers.map((header) => (
              <div key={header} className='last:text-right'>
                {header}
              </div>
            ))}
          </div>

          {rows.map(({ applicationName, permissions, authorizationDate, action }, index) => (
            <div key={index} className='grid grid-cols-4 gap-4  text-[15px] font-medium'>
              <div>{applicationName}</div>
              <div>{permissions}</div>
              <div>{authorizationDate}</div>
              <div className='text-red  cursor-pointer text-right '>{action}</div>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
};
