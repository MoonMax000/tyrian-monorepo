import Button from '@/components/ui/Button/Button';
import Paper from '@/components/ui/Paper/Paper';
import { FC } from 'react';

export const DonationFromSubscribers: FC = () => {
  return (
    <Paper className='flex justify-between items-center p-4'>
      <div className='flex flex-col'>
        <h2 className='text-[15px] font-semibold'>
          Donations from Subscribers
        </h2>
        <span className='text-[15px] font-medium text-lighterAluminum'>
          Receive support from your viewers
        </span>
      </div>

      <Button className='py-3 w-[180px]'>Connect</Button>
    </Paper>
  );
};
