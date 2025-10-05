'use client';

import { FC, useState } from 'react';
import KeyIcon from '@/assets/input/key.svg';
import EyeIcon from '@/assets/input/eye.svg';
import EyeCloseIcon from '@/assets/input/closeEye.svg';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input';
import Validator from '@/components/ui/Validator/Validator';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import VerifyStep from '@/components/VerifyStep/VerifyStep';
import Paper from '@/components/ui/Paper/Paper';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AuthService, ChangePasswordParams } from '@/services/AuthService';

interface FormData {
  password: string;
  confirmPassword: string;
  oldPassword: string;
}

const ChangePassword: FC<{ onClose: () => void }> = ({ onClose }) => {
  const [step, setStep] = useState<'change_password' | '2fa' | 'success'>(
    'change_password',
  );

  const [isPasswordVaild, setIsPasswordVaild] = useState<boolean>(false);
  const [isShownPasswords, setIsShownPasswords] = useState<{
    oldPassword: boolean;
    password: boolean;
    confirmPassword: boolean;
  }>({ oldPassword: false, password: false, confirmPassword: false });
  const [credentials, setCredentials] = useState<ChangePasswordParams>({
    old_password: '',
    new_password: '',
  });

  const { data: profile } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
  });

  const { mutateAsync: changeFieldsVerification } = useMutation({
    mutationKey: ['changeVerification'],
    mutationFn: () =>
      AuthService.changeFieldsVerification({
        email: profile?.email,
        fields_to_change: ['password'],
      }),
    onError: () => setStep('change_password'),
  });

  const { mutate: changePassword } = useMutation({
    mutationKey: ['change-password'],
    mutationFn: (body: ChangePasswordParams) =>
      AuthService.changePassword(body),
  });

  const toggleShown = (
    key: 'password' | 'confirmPassword' | 'oldPassword',
  ): void => {
    setIsShownPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Required field';
    return true;
  };

  const onSubmit = (data: {
    password: string;
    confirmPassword: string;
    oldPassword: string;
  }) => {
    if (!isValid || !isPasswordVaild || !!errors.password) return;
    changeFieldsVerification().then(() => {
      setCredentials((prev) => ({
        ...prev,
        old_password: data.oldPassword,
        new_password: data.confirmPassword,
      }));
      setStep('2fa');
    });
  };

  const [codeEror, setCodeError] = useState<string>('');

  const verifySubmitPassword = () => {
    changePassword(credentials);
    setStep('success');
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Required field';
    if (value !== watch('password')) return 'The passwords do not match';
    return true;
  };

  const passwordValue = watch('password');

  const renderContent = () => {
    switch (step) {
      case 'change_password':
        return (
          <div className='my-10'>
            <h4 className='text-2xl font-bold text-left mb-2'>
              Change password
            </h4>
            <p className='text-[15px] font-normal text-webGray mb-12 text-left'>
              For your security, please enter your current password and choose a
              new one.
            </p>
            <form
              className='flex flex-col gap-[50px] justify-between'
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className='flex flex-col'>
                <Input
                  typeof='password'
                  placeholder='Current Password'
                  containerClassName='mb-[10px]'
                  leftIcon={
                    <div className='opacity-45 mr-2'>
                      <KeyIcon width={20} height={20} className='text-white' />
                    </div>
                  }
                  rightIcon={
                    <div
                      className='opacity-45 ml-1'
                      onClick={() => toggleShown('oldPassword')}
                    >
                      {isShownPasswords.oldPassword ? (
                        <EyeCloseIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      ) : (
                        <EyeIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      )}
                    </div>
                  }
                  type={isShownPasswords.oldPassword ? 'text' : 'password'}
                  {...register('oldPassword', {
                    validate: validatePassword,
                  })}
                  error={errors.oldPassword?.message}
                  inputWrapperClassName={'min-h-11 border-0'}
                  autoComplete='old-password'
                />
                <Input
                  placeholder='Password'
                  containerClassName='mb-[10px]'
                  leftIcon={
                    <div className='opacity-45 mr-2'>
                      <KeyIcon width={20} height={20} className='text-white' />
                    </div>
                  }
                  rightIcon={
                    <div
                      className='opacity-45 ml-1'
                      onClick={() => toggleShown('password')}
                    >
                      {isShownPasswords.password ? (
                        <EyeCloseIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      ) : (
                        <EyeIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      )}
                    </div>
                  }
                  type={isShownPasswords.password ? 'text' : 'password'}
                  {...register('password', {
                    validate: validatePassword,
                  })}
                  error={errors.password?.message}
                  inputWrapperClassName={'min-h-11 border-0'}
                  autoComplete='new-password'
                />

                <Validator
                  setIsValid={setIsPasswordVaild}
                  password={passwordValue}
                />
                <Input
                  containerClassName='mt-[10px]'
                  placeholder='Repeat password'
                  leftIcon={
                    <div className='opacity-45 mr-2'>
                      <KeyIcon width={20} height={20} className='text-white' />
                    </div>
                  }
                  rightIcon={
                    <div
                      className='opacity-45 ml-1'
                      onClick={() => toggleShown('confirmPassword')}
                    >
                      {isShownPasswords.confirmPassword ? (
                        <EyeCloseIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      ) : (
                        <EyeIcon
                          width={24}
                          height={24}
                          className='text-white'
                        />
                      )}
                    </div>
                  }
                  type={isShownPasswords.confirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    validate: validateConfirmPassword,
                  })}
                  error={errors.confirmPassword?.message}
                  inputWrapperClassName={'min-h-11 border-0'}
                  autoComplete='new-password'
                />
              </div>
              <div className='flex gap-4 justify-between'>
                <Button
                  ghost
                  className='text-lighterAluminum w-full'
                  type='button'
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
                <Button className='w-full' type='submit'>
                  Continue
                </Button>
              </div>
            </form>
          </div>
        );
      case '2fa':
        return (
          <div className='h-[537px]'>
            <VerifyStep
              title='Verify Change Password'
              description={
                <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
                  We’ve sent a 6-digit code to your email:{' '}
                  <span className='text-white'>example@gmail.com.</span>. Please
                  enter it below to confirm the password change.
                </p>
              }
              onBack={() => setStep('change_password')}
              handleSubmit={verifySubmitPassword}
              setCodeError={setCodeError}
              onResendCode={() => {}}
              codeError={codeEror}
            />
          </div>
        );
      case 'success':
        return (
          <div className='h-[537px]'>
            <SuccessStep
              title='Password Changed'
              description='Your password has been successfully changed. You’ll need to use your new password the next time you sign in.'
              onSubmit={() => onClose()}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Paper className='w-[393px] px-[26px] py-6 border-none'>
      {renderContent()}
    </Paper>
  );
};

export default ChangePassword;
