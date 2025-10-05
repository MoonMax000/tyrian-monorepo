'use client';

import { FC, useState, SetStateAction } from 'react';
import Button from '@/components/ui/Button/Button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import KeyIcon from '@/assets/input/key.svg';
import EyeIcon from '@/assets/input/eye.svg';
import EyeCloseIcon from '@/assets/input/closeEye.svg';

interface FormData {
  password: string;
}

const DeleteAccountStep: FC<{
  onClose: () => void;
  setStep: (
    value: SetStateAction<'delete' | 'verrify' | 'sure' | 'success'>,
  ) => void;
  onSubmitStep: () => void;
}> = ({ onClose, setStep, onSubmitStep }) => {
  const [isShownPassword, setIsShownPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ mode: 'onChange' });

  const toggleShown = () => setIsShownPassword((prev) => !prev);

  const validatePassword = (value: string) => {
    if (!value) return 'Required field';
    return true;
  };
  const onSubmit = () => {
    if (!isValid || !!errors.password) return;
    setStep('verrify');
    onSubmitStep();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-[30px] h-full justify-between'
    >
      <div className='flex flex-col gap-[24px]'>
        <div>
          <h2 className='text-[24px] font-bold'>Delete Your Account</h2>
          <p className='text-[15px] font-[500] text-lighterAluminum mt-2'>
            Deleting your account will permanently remove your profile, data and
            all social activity. This action cannot be undone.
          </p>
        </div>

        <div className='flex flex-col gap-[8px] text-[15px] font-[500] text-lighterAluminum'>
          <p>When your account is deleted:</p>
          <ul className='list-disc list-inside'>
            <li>Your profile and content will be erased</li>
            <li>You will lose access to all data</li>
            <li>This cannot be recovered</li>
          </ul>
        </div>

        <Input
          placeholder='Current password'
          containerClassName='mt-4'
          leftIcon={
            <div className='opacity-45 mr-2'>
              <KeyIcon width={20} height={20} className='text-white' />
            </div>
          }
          rightIcon={
            <div
              className='opacity-45 ml-1 cursor-pointer'
              onClick={toggleShown}
            >
              {isShownPassword ? (
                <EyeCloseIcon width={24} height={24} className='text-white' />
              ) : (
                <EyeIcon width={24} height={24} className='text-white' />
              )}
            </div>
          }
          type={isShownPassword ? 'text' : 'password'}
          {...register('password', { validate: validatePassword })}
          error={errors.password?.message}
          inputWrapperClassName='min-h-11 border-0'
          autoComplete='new-password'
        />
      </div>

      <div className='flex justify-between gap-[16px]'>
        <Button
          ghost
          type='button'
          onClick={onClose}
          className='w-[165.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-white'
        >
          Cancel
        </Button>
        <Button type='submit' className='w-[165.5px] h-[44px] p-[10px]'>
          Continue
        </Button>
      </div>
    </form>
  );
};

export default DeleteAccountStep;
