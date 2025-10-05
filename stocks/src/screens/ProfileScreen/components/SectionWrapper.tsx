import Paper from '@/components/Paper';
import becomeProBackground from '@/assets/become-pro-background.png';
import type { FC, ReactNode } from 'react';
import Button from '@/components/UI/Button';

const SectionWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className='grid grid-cols-[1fr,auto] gap-6'>
      {children}

      <Paper
        style={{ backgroundImage: `url(${becomeProBackground.src})` }}
        className='relative !p-0 flex flex-col gap-[80px] justify-center items-center bg-no-repeat bg-cover w-[348px] h-[436px]'
      >
        <div className='flex flex-col gap-6 px-4'>
          <h3 className='text-h4 text-center'>Unlock New opportunities</h3>
          <p className='text-center text-body-15 opacity-[48%]'>Try all new service features risk-free for 7 days! Get started now!</p>
        </div>

        <Button className='absolute bottom-12 w-[180px] h-10 font-bold bg-opacity-25'>Upgrade to PRO</Button>
      </Paper>
    </div>
  );
};

export default SectionWrapper;
