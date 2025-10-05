import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { AuthorizationService } from '@/services/AuthorizationService';
import { IValidationSchema, useForm } from '@/hooks/useForm';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { FC, useState } from 'react';
import PostIcon from '@/assets/icons/input/post.svg';
import KeyIcon from '@/assets/icons/input/key.svg';
import EyeIcon from '@/assets/icons/input/eye.svg';
import EyeCloseIcon from '@/assets/icons/input/closeEye.svg';
const replaceWithStars = (email: string): string => {
  let result = email.substring(0, 2);
  for (let i = 2; i < email.indexOf('@'); i++) {
    result += '*';
  }
  result += email.substring(email.indexOf('@'));
  return result;
};

const validation = {
  email: [
    {
      check: (val) => !!val,
      message: 'Required field',
    },
    {
      check: (val) => REGULAR_EXPRESSIONS.email.test(val),
      message: 'Please enter a valid address',
    },
  ],
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

interface FormState {
  login: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initFormState: FormState = {
  login: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegistrationModal: FC = () => {
  const [step, setStep] = useState<string>('registration');
  const [isShownPasswords, setIsShownPasswords] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });

  const toogleShown = (key: 'password' | 'confirmPassword'): void => {
    setIsShownPasswords((prev) => {
      return { ...prev, [key]: !prev[key] };
    });
  };
  const form = useForm<FormState>(
    async () => {
      try {
        const { data } = await AuthorizationService.registration({
          email: form.formData.email,
          password: form.formData.password,
        });
        setStep('succes');
        console.log('data', data);
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'response' in err &&
          err.response &&
          typeof err.response === 'object' &&
          'status' in err.response &&
          err.response.status === 400 &&
          'data' in err.response
        ) {
          const serverErrors: Partial<Record<keyof FormState, string>> = {};
          const errorData = (err.response as { data: Record<string, string[]> }).data;

          Object.keys(errorData).forEach((key) => {
            serverErrors[key as keyof FormState] = errorData[key][0];
          });

          form.setExternalErrors(serverErrors);
        }
      }
    },
    validation,
    initFormState,
  );

  return (
    <>
      {step === 'registration' ? (
        <form onSubmit={form.handleSubmit}>
          <div className='flex flex-col gap-6 mb-6'>
            <Input
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Email'
              onChange={(event) => form.handleChangeField('email')(event.target.value)}
              value={form.formData.email}
              error={form.formData.email && form.errors.email}
            />
            <Input
              placeholder='Password'
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <KeyIcon width={16} height={16} className='text-white ' />
                </div>
              }
              icon={
                <div className='opacity-45 ml-1' onClick={() => toogleShown('password')}>
                  {isShownPasswords.password ? (
                    <EyeCloseIcon width={24} height={24} className='text-white ' />
                  ) : (
                    <EyeIcon width={24} height={24} className='text-white' />
                  )}
                </div>
              }
              type={isShownPasswords.password ? 'text' : 'password'}
              onChange={(event) => form.handleChangeField('password')(event.target.value)}
              value={form.formData.password}
              error={form.formData.password && form.errors.password}
              inputWrapperClassName={'min-h-11 border-0'}
            />
            <Input
              placeholder='Repeat password'
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <KeyIcon width={16} height={16} className='text-white ' />
                </div>
              }
              icon={
                <div className='opacity-45 ml-1' onClick={() => toogleShown('confirmPassword')}>
                  {isShownPasswords.confirmPassword ? (
                    <EyeCloseIcon width={24} height={24} className='text-white ' />
                  ) : (
                    <EyeIcon width={24} height={24} className='text-white' />
                  )}
                </div>
              }
              type={isShownPasswords.confirmPassword ? 'text' : 'password'}
              onChange={(event) => form.handleChangeField('confirmPassword')(event.target.value)}
              value={form.formData.confirmPassword}
              error={form.formData.confirmPassword && form.errors.confirmPassword}
              inputWrapperClassName={'min-h-11 border-0'}
            />
          </div>
          <div className='flex items-center justify-center w-full'>
            <Button className='mx-auto min-h-10 w-full' type='submit' disabled={!form.isValid}>
              Создать аккаунт
            </Button>
          </div>
        </form>
      ) : (
        <>
          <p className='mb-6 text-body-15 opacity-[48%]'>
            {`A confirmation email has been sent to ${replaceWithStars(form.formData.email)}. To verify your account, please follow the link in the email.`}
          </p>
        </>
      )}
    </>
  );
};

export default RegistrationModal;
