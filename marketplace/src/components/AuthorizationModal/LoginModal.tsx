'use client';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { setCookie } from '@/utils/cookie';
import { AuthorizationService } from '@/services/AuthorizationService';

import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import PostIcon from '@/assets/icons/input/post.svg';
import KeyIcon from '@/assets/icons/input/key.svg';
import EyeIcon from '@/assets/icons/input/eye.svg';
import EyeCloseIcon from '@/assets/icons/input/closeEye.svg';
import { useQueryClient } from '@tanstack/react-query';
import { TAuthorizationModal } from '@/types/auth';
import Input from '../UI/Input';
import Button from '../UI/Button/Button';

interface FormState {
  identity: string;
  password: string;
}

const LoginModal: FC<{
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ onModalChange }) => {
  const queryClient = useQueryClient();
  const [shownPassword, setShownPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm<FormState>({
    mode: 'onChange',
    defaultValues: {
      identity: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormState) => {
    try {
      const { data: response } = await AuthorizationService.login({
        email: data.identity,
        password: data.password,
      });
      console.log(response.data.token, 'aaaaaaaa');
      setCookie('access-token', response.data.token);
      queryClient.invalidateQueries({ queryKey: ['getProfileData'] });
      onModalChange(null);
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'status' in err.response &&
        'data' in err.response
      ) {
        setError('identity', {
          type: 'manual',
          message: 'Incorrect email or password',
        });
      }
    }
  };

  const toggleShown = () => {
    setShownPassword((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='flex flex-col gap-6 mb-6'>
        <Input
          leftIcon={
            <div className='opacity-45 mr-2'>
              <PostIcon width={20} height={20} className='text-white' />
            </div>
          }
          placeholder='Email'
          inputWrapperClassName='min-h-11 border-0'
          {...register('identity', {
            required: 'Required field',
            pattern: {
              value: REGULAR_EXPRESSIONS.email,
              message: 'Please enter a valid email address',
            },
          })}
          error={errors.identity?.message}
        />
        <div>
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
                  toggleShown();
                }}
              >
                {shownPassword ? (
                  <EyeCloseIcon width={24} height={24} className='text-white' />
                ) : (
                  <EyeIcon width={24} height={24} className='text-white' />
                )}
              </div>
            }
            type={shownPassword ? 'text' : 'password'}
            inputWrapperClassName='min-h-11 border-0'
            {...register('password', {
              required: 'Required field',
            })}
            error={errors.password?.message}
            // isfillTextWhileError={true}
          />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center w-full'>
        <Button className='mx-auto w-full' disabled={!isValid}>
          Sign In
        </Button>
        <button
          type='button'
          className='text-body-15 font-bold text-purple mt-4 underline'
          onClick={(event) => {
            event.stopPropagation();
            onModalChange('recovery');
          }}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginModal;
