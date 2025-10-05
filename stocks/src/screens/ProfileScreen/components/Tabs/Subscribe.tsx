import Button from '@/components/UI/Button';
import SectionWrapper from '../SectionWrapper';
import Paper from '@/components/Paper';
import Toggle from '@/components/UI/Toggle';
import { useState } from 'react';

const Subscribe = () => {
  const [isActiveSubscribe, setIsActiveSubscribe] = useState<boolean>(true);

  return (
    <SectionWrapper>
      <div className='flex flex-col gap-6'>
        <Paper className='!px-0'>
          <div className='border-b border-onyxGrey pb-4'>
            <h1 className='text-h4 pl-6'>Subscription</h1>
          </div>
          <div className='border-t-2 border-blackedGray mt-4'>
            <div className='px-6 flex items-center justify-between'>
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-5'>
                  <p className='text-body-15'>Base Plan</p>
                  <div className='bg-darkGreen rounded-[4px] px-1 py-[2px]'>
                    <span className='text-body-15 !font-bold text-green'>ACTIVE</span>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <p className='text-body-15 opacity-[48%]'>Access</p>
                  <p className='text-body-15'>Limited Access</p>
                </div>
              </div>

              <Button className='!w-[180px] h-10'>Change Plan</Button>
            </div>
          </div>
        </Paper>

        <Paper className='flex items-center justify-between'>
          <div className='flex flex-col gap-4'>
            <h2 className='text-h4'>Payment</h2>
            <p className='text-body-15 opacity-[48%]'>Auto-pay</p>
          </div>

          <Toggle
            isActive={isActiveSubscribe}
            onChange={() => setIsActiveSubscribe((prev) => !prev)}
          />
        </Paper>
      </div>
    </SectionWrapper>
  );
};

export default Subscribe;
