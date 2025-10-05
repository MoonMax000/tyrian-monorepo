'use client';
import Input from '../UI/Input';
import Button from '../UI/Button/Button';
import { AuthorizationService } from '@/services/AuthorizationService';
import { FC, useState } from 'react';
import PostIcon from '@/assets/icons/input/post.svg';
import KeyIcon from '@/assets/icons/input/key.svg';
import EyeIcon from '@/assets/icons/input/eye.svg';
import EyeCloseIcon from '@/assets/icons/input/closeEye.svg';
import { useForm } from 'react-hook-form';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';

const replaceWithStars = (email: string): string => {
  let result = email.substring(0, 2);
  for (let i = 2; i < email.indexOf('@'); i++) {
    result += '*';
  }
  result += email.substring(email.indexOf('@'));
  return result;
};

interface FormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationModal: FC = () => {
  const [step, setStep] = useState<'registration' | 'success'>('registration');
  const [isShownPasswords, setIsShownPasswords] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    getValues,
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const toggleShown = (key: 'password' | 'confirmPassword'): void => {
    setIsShownPasswords((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const validateEmail = (value: string) => {
    if (!value) return 'Required field';
    if (!REGULAR_EXPRESSIONS.email.test(value)) return 'Please enter a valid address';
    return true;
  };

  const validateUserName = (value: string) => {
    if (!value) return 'Required field';
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Required field';
    if (value.length < 8) return 'Password must be at least 8 characters long';
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return 'Required field';
    if (value !== watch('password')) return 'The passwords do not match';
    return true;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const { data: response } = await AuthorizationService.registration({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        username: data.userName,
      });
      setStep('success');
      console.log('data', response);
    } catch (err: any) {
      if (err.response?.status === 400) {
        const errorData = err.response.data;

        Object.keys(errorData).forEach((key) => {
          setError(key as keyof FormData, {
            type: 'server',
            message: errorData[key][0],
          });
        });
      }
    }
  };

  return (
    <>
      {step === 'registration' ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-6 mb-6'>
            <Input
              leftIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Username'
              {...register('userName', {
                validate: validateUserName,
              })}
              error={errors.userName?.message}
              autoComplete='userName'
            />
            <Input
              leftIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Email'
              {...register('email', {
                validate: validateEmail,
              })}
              error={errors.email?.message}
              autoComplete='email'
            />
            <Input
              placeholder='Password'
              leftIcon={
                <div className='opacity-45 mr-2'>
                  <KeyIcon width={16} height={16} className='text-white' />
                </div>
              }
              rightIcon={
                <div
                  className='opacity-45 ml-1'
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleShown('password');
                  }}
                >
                  {isShownPasswords.password ? (
                    <EyeCloseIcon width={24} height={24} className='text-white' />
                  ) : (
                    <EyeIcon width={24} height={24} className='text-white' />
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
            <Input
              placeholder='Repeat password'
              leftIcon={
                <div className='opacity-45 mr-2'>
                  <KeyIcon width={16} height={16} className='text-white' />
                </div>
              }
              rightIcon={
                <div
                  className='opacity-45 ml-1'
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleShown('confirmPassword');
                  }}
                >
                  {isShownPasswords.confirmPassword ? (
                    <EyeCloseIcon width={24} height={24} className='text-white' />
                  ) : (
                    <EyeIcon width={24} height={24} className='text-white' />
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
          <div className='flex items-center justify-center w-full'>
            <Button className='mx-auto min-h-10 w-full' disabled={!isValid}>
              Sign In
            </Button>
          </div>
        </form>
      ) : (
        <p className='mb-6 text-body-15 opacity-[48%]'>
          {`A confirmation email has been sent to ${replaceWithStars(
            getValues('email'),
          )}. To verify your account, please follow the link in the email.`}
        </p>
      )}
    </>
  );
};

export default RegistrationModal;
