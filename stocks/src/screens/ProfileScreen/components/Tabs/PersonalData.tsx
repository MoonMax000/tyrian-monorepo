import Paper from '@/components/Paper';
import Button from '@/components/UI/Button';
import Image from 'next/image';
import mockAvatar from '@/assets/mock-profile-avatar.png';
import Input from '@/components/UI/Input';
import IconEdit from '@/assets/icons/edit.svg';
import SectionWrapper from '../SectionWrapper';

const PersonalData = () => {
  return (
    <section className='flex flex-col gap-6'>
      <SectionWrapper>
        <Paper>
          <h1 className='text-h4'>Personal Information</h1>
          <div className='mt-6 flex items-start gap-6'>
            <Image
              src={mockAvatar.src}
              alt='avatar'
              width={128}
              height={128}
              className='min-w-[128px] min-h-[128px] rounded-[50%]'
            />
            <div className='flex flex-col gap-6 w-full'>
              <Input
                inputWrapperClassName='bg-moonlessNight'
                label='Username'
              />
              <Input
                inputWrapperClassName='bg-moonlessNight'
                label='Email'
                icon={
                  <button type='button'>
                    <IconEdit className="size-5" />
                  </button>
                }
              />
              <Input
                inputWrapperClassName='bg-moonlessNight'
                label='Investment Experience'
              />
            </div>
          </div>
        </Paper>
      </SectionWrapper>

      <Paper className='flex items-center justify-between'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-h4'>Account Deletion</h2>
          <p className='text-body-15 opacity-[48%]'>Warning! After accpunt deletion, you will permanently lose access to your personal dashboard.</p>
        </div>

        <Button variant='danger' className='w-[180px] h-10'>
          Delete Account
        </Button>
      </Paper>
    </section>
  );
};

export default PersonalData;
