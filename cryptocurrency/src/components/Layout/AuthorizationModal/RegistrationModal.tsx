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

const validation = {
  login: [
    {
      check: (val) => !!val,
      message: 'Обязательно поле',
    },
    {
      check: (val) => val.length >= 3,
      message: 'Логин должен содержать не менее 3 символов',
    },
  ],
  email: [
    {
      check: (val) => !!val,
      message: 'Обязательно поле',
    },
    {
      check: (val) => REGULAR_EXPRESSIONS.email.test(val),
      message: 'Введите корректный адрес',
    },
  ],
  password: [
    {
      check: (val) => !!val,
      message: 'Обязательно поле',
    },
    {
      check: (val) => val.length >= 8,
      message: 'Пароль не должен содержать менее 8 символов',
    },
  ],
  confirmPassword: [
    {
      check: (val) => !!val,
      message: 'Обязательно поле',
    },
    {
      check: (val, formData) => val === formData.password,
      message: 'Пароли не совпадают',
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
const replaceWithStars = (email: string): string => {
  let result = email.substring(0, 2);
  for (let i = 2; i < email.indexOf('@'); i++) {
    result += '*';
  }
  result += email.substring(email.indexOf('@'));
  return result;
};

type TRegistrationState = 'registration' | 'success';
const RegistrationModal: FC = () => {
  const [registrationState, setRegistrationState] = useState<TRegistrationState>('registration');
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
          username: form.formData.login,
          email: form.formData.email,
          password: form.formData.password,
          confirmPassword: form.formData.confirmPassword,
        });
        console.log('data', data);
        setRegistrationState('success');
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
      {registrationState === 'registration' ? (
        <form onSubmit={form.handleSubmit}>
          <div className='flex flex-col gap-6 mb-6'>
            <Input
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Имя пользователя'
              onChange={(event) => form.handleChangeField('login')(event.target.value)}
              value={form.formData.login}
              error={form.formData.login && form.errors.login}
            />

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
              placeholder='Пароль'
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
              placeholder='Повторите пароль'
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
        <div>
          <p className='mb-6 text-basic opacity-[48%]'>
            {`Письмо с подтверждением было отправлено на ${replaceWithStars(
              form.formData.email,
            )}. Чтобы подтвердить свою учетную запись, пожалуйста, перейдите по ссылке в письме.`}
          </p>
        </div>
      )}
    </>
  );
};

export default RegistrationModal;
