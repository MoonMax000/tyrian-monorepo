'use client';
import { FC, useState } from 'react';
import Modal from '../UI/ModalWrapper';
import authorizationAdvertisementBackground from '@/assets/authorization-advertisement-background.png';
import IconEyeOpen from '@/assets/icons/input/eye.svg';
import IconEyeClose from '@/assets/icons/input/closeEye.svg';
import { useMutation } from '@tanstack/react-query';
import { AuthorizationService } from '@/services/AuthorizationService';
import KeyIcon from '@/assets/icons/input/key.svg';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '../UI/Input';
import Button from '../UI/Button/Button';

interface FormState {
  password: string;
  confirmPassword: string;
}

interface IFormShownState {
  password: boolean;
  confirmPassword: boolean;
}

interface IResetPasswordProps {
  token: string;
}

const initShown: IFormShownState = {
  password: false,
  confirmPassword: false,
};

const ResetPassword: FC<IResetPasswordProps> = ({ token }) => {
  const [isShown, setIsShown] = useState<IFormShownState>(initShown);
  const router = useRouter();
  const toggleIsShown = (field: keyof IFormShownState) => {
    setIsShown((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['SendMessage'],
    mutationFn: async (formData: FormState) => {
      const loginBody = {
        token,
        new_password: formData.password,
        new_password_confirm: formData.confirmPassword,
      };

      try {
        const data = await AuthorizationService.resetPassword(loginBody);
        console.log(data);
        return data;
      } catch (error) {
        console.log('Login failed:', error);
      }
    },
    onSuccess: (data) => {
      switch (data?.status) {
        case 200:
        case 201:
        case 204:
          alert('Your password has been changed.');
          router.push('/');
          break;
        default:
          alert('The link has expired, try to get a new one');
          router.push('/');
      }
    },
    onError: (error) => {
      console.log('invalid CurrentPassword', error);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormState>({
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: FormState) => {
    mutateAsync(data);
  };

  const passwordValue = watch('password');
  const confirmPasswordValue = watch('confirmPassword');

  const passwordsMatch = passwordValue === confirmPasswordValue && passwordValue.length > 0;

  return (
    <Modal
      onClose={() => {
        router.push('/');
      }}
    >
      <div className='grid grid-cols-2 items-center max-w-[768px] bg-blackedGray rounded-[16px]'>
        <div className='px-6 py-[70px]'>
          <h4 className='text-[24px] font-bold text-center mb-6'>Password recovery</h4>
          <p className='mb-6 text-body-15 opacity-[48%]'>
            Your new password must not match any previously used passwords.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-4 mb-6'>
              <Input
                placeholder='New password'
                leftIcon={
                  <div className='opacity-45 mr-2'>
                    <KeyIcon width={16} height={16} className='text-white' />
                  </div>
                }
                error={errors.password?.message}
                inputWrapperClassName='min-h-11 border-0'
                type={isShown.password ? 'text' : 'password'}
                rightIcon={
                  <button
                    type='button'
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleIsShown('password');
                    }}
                    className='w-6 flex items-center '
                  >
                    {isShown.password ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
                {...register('password', {
                  required: 'Required field',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                })}
              />
              <Input
                placeholder='Repeat password'
                leftIcon={
                  <div className='opacity-45 mr-2'>
                    <KeyIcon width={16} height={16} className='text-white' />
                  </div>
                }
                error={errors.confirmPassword?.message}
                inputWrapperClassName='min-h-11 border-0'
                type={isShown.confirmPassword ? 'text' : 'password'}
                rightIcon={
                  <button
                    type='button'
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleIsShown('confirmPassword');
                    }}
                    className='w-6 flex items-center '
                  >
                    {isShown.confirmPassword ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
                {...register('confirmPassword', {
                  required: 'Required field',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters long',
                  },
                  validate: (value) => value === passwordValue || 'The passwords do not match',
                })}
              />
            </div>
            <Button
              className='mx-auto max-w-[180px] h-10 w-full'
              disabled={!isValid || !passwordsMatch || isPending}
            >
              {isPending ? 'Changing...' : 'Change password'}
            </Button>
          </form>
        </div>

        <div
          className='bg-[#FFFFFF05] backdrop-blur-[240px] pt-8 pb-[27px] px-6 rounded-r-xl bg-cover h-full'
          style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
        >
          <div className='w-[100px] mx-auto mb-12'>
            <Image src='/logo.png' alt='Logo' className='cursor-pointer' width={128} height={240} />
          </div>
          <h2 className='text-2xl font-bold text-center'>
            Join 100,000+ Tyrian Trade Community Members
          </h2>
          <p className='mt-4 text-[15px] font-bold opacity-[48%] text-center'>
            Become part of an active community of investors and traders. We offer various tariffs,
            including 7 days of free access! Unlock all the platform’s features, get tips and share
            experiences. Improve your investment skills with Tyrian Trade!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPassword;
