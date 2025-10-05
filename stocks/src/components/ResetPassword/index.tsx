'use client';
import { FC, useState } from 'react';
import Modal from '../UI/Modal';
import authorizationAdvertisementBackground from '@/assets/authorization-advertisement-background.png';
import Input from '../UI/Input';
import Button from '../UI/Button';
import IconEyeOpen from '@/assets/icons/eyes/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/eyes/icon-eye-close.svg';
import { useMutation } from '@tanstack/react-query';
import { AuthorizationService } from '@/services/AuthorizationService';
import { IValidationSchema, useForm } from '@/hooks/useForm';
import KeyIcon from '@/assets/icons/input/key.svg';
import LogoIcon from '@/assets/logo.svg';

interface FormState {
  password: string;
  confirmPassword: string;
}
interface IformShownStaete {
  password: boolean;
  confimPaswword: boolean;
}
const initShown: IformShownStaete = {
  password: false,
  confimPaswword: false,
};
type ShownFields = 'password' | 'confimPaswword';

interface IResetPaswordProps {
  token: string;
  uid: string;
}
const initFormState: FormState = {
  password: '',
  confirmPassword: '',
};
const validation = {
  password: [
    {
      check: (val) => !!val,
      message: 'Required field',
    },
    {
      check: (val) => val.length >= 8,
      message: 'Password must be at least 8 characters long',
    },
  ],
  confirmPassword: [
    {
      check: (val) => !!val,
      message: 'Required field',
    },
    {
      check: (val, formData) => val === formData.password,
      message: 'The passwords do not match',
    },
  ],
} as IValidationSchema;

const ResetPasword: FC<IResetPaswordProps> = ({ token, uid }) => {
  const [isShown, setIsShown] = useState<IformShownStaete>(initShown);
  const ToogleIsShown = (field: ShownFields) => {
    setIsShown((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['SendMessage'],
    mutationFn: async () => {
      const loginBody = {
        uid: uid,
        token: token,
        new_password: form.formData.password,
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
        case 201:
          alert('Your password has been changed.');
          window.close();
          break;
        case 204:
          alert('Your password has been changed.');
          window.close();
          break;
        default:
          alert('The link has expired, try to get a new one');
          window.close();
      }
    },
    onError: (error) => {
      console.log('invalid CurrentPassword', error);
    },
  });

  const handleReset = () => {
    mutateAsync();
  };

  const form = useForm<FormState>(handleReset, validation, initFormState);

  return (
    <Modal isOpen={true} contentClassName='!pr-0 !overflow-hidden'>
      <div className='grid grid-cols-2 items-center'>
        <div className='px-6 py-[70px]'>
          <h4 className='text-h4 text-center mb-6'>Password recovery</h4>

          <p className='mb-6 text-body-15 opacity-[48%]'>
            Your new password must not match any previously used passwords.
          </p>
          <div>
            <div className='flex flex-col gap-4 mb-6'>
              <Input
                label='Новый пароль'
                beforeIcon={
                  <div className='opacity-45 mr-2'>
                    <KeyIcon width={16} height={16} className='text-white ' />
                  </div>
                }
                error={form.formData.password && form.errors.password}
                inputWrapperClassName={'min-h-11 border-0'}
                onChange={(event) => form.handleChangeField('password')(event.target.value)}
                value={form.formData.password}
                type={isShown.password ? 'text' : 'password'}
                icon={
                  <button type='button' onClick={() => ToogleIsShown('password')}>
                    {isShown.password ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
              />
              <Input
                label='Повторите пароль'
                beforeIcon={
                  <div className='opacity-45 mr-2'>
                    <KeyIcon width={16} height={16} className='text-white ' />
                  </div>
                }
                onChange={(event) => form.handleChangeField('confirmPassword')(event.target.value)}
                value={form.formData.confirmPassword}
                type={isShown.confimPaswword ? 'text' : 'password'}
                icon={
                  <button type='button' onClick={() => ToogleIsShown('confimPaswword')}>
                    {isShown.confimPaswword ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
                error={form.formData.confirmPassword && form.errors.confirmPassword}
                inputWrapperClassName={'min-h-11 border-0'}
              />
            </div>
            <Button
              className='mx-auto max-w-[180px] h-10 w-full'
              type='submit'
              disabled={!form.isValid || isPending}
              onClick={handleReset}
            >
              Change password
            </Button>
          </div>
        </div>

        <div
          className='bg-[#FFFFFF05] backdrop-blur-[240px] py-[70px] px-6 rounded-r-xl bg-cover h-full'
          style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
        >
          <LogoIcon width={100} height={128} alt='logo' className='mx-auto mb-12 !width-[100px]' />
          <h2 className='text-h3 text-center'>Join the 100,000+ Turian trade community </h2>
          <p className='mt-4 text-body-15 opacity-[48%] text-center'>
            Become part of an active community of investors and traders. We offer various tariffs,
            including 7 days of free access! Unlock all the platform&apos;s features, get tips and
            share experiences. Improve your investment skills with Turian trade!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasword;
