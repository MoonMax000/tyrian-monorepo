import { FC, useMemo, useState } from 'react';
import TextInput from '@/components/UI/TextInput';
import Button from '@/components/UI/Button/Button';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { IValidationSchema, useForm } from '@/utilts/hooks/useForm';
import { useRegisterMutation } from '@/store/api';
import PostIcon from '@/assets/icons/input/post.svg';
import KeyIcon from '@/assets/icons/input/key.svg';
import EyeIcon from '@/assets/icons/input/eye.svg';
import EyeCloseIcon from '@/assets/icons/input/closeEye.svg';

const validation = {
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

const replaceWithStars = (email: string): string => {
  let result = email.substring(0, 2);
  for (let i = 2; i < email.indexOf('@'); i++) {
    result += '*';
  }
  result += email.substring(email.indexOf('@'));
  return result;
};

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

type TRegistrationState = 'registration' | 'success';

const RegistrationModal: FC = () => {
  const [isShownPasswords, setIsShownPasswords] = useState<{
    password: boolean;
    confirmPassword: boolean;
  }>({ password: false, confirmPassword: false });

  const toogleShown = (key: 'password' | 'confirmPassword'): void => {
    setIsShownPasswords((prev) => {
      return { ...prev, [key]: !prev[key] };
    });
  };
  const [registrationState, setRegistrationStae] = useState<TRegistrationState>('registration');
  const [register, { isLoading }] = useRegisterMutation();
  const form = useForm<FormState>(
    async (data) => {
      try {
        await register({
          username: data.login,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }).unwrap();
        setRegistrationStae('success');
      } catch (err) {
        form.setExternalErrors({ email: 'Пользователь с таким email уже существует' });
        console.log('Ошибка регистрации: ', err);
      }
    },
    validation,
    initFormState,
  );

  const emailError = useMemo(
    () => form.formData['email']?.toString() && form.errors['email'],
    [form.errors, form.formData]
  );

  const passwordError = useMemo(
    () => form.formData['password']?.toString() && form.errors['password'],
    [form.errors, form.formData]
  );

  return (
    <>
      {registrationState === 'registration' ? (
        <form onSubmit={form.handleSubmit} className='flex flex-col'>
          <div className='flex flex-col gap-4 mb-6'>
            <span className='text-red text-right text-sm'>
              {emailError ? (
                emailError
              ) : passwordError ? (
                passwordError
              ) : <>&nbsp;</>}
            </span>
            <TextInput
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Имя пользователя'
              onChange={(e) => form.handleChangeField('login')(e.target.value)}
              value={form.formData.login}
              error={form.formData.login && form.errors.login}
            />

            <TextInput
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white' />
                </div>
              }
              inputWrapperClassName={'min-h-11 border-0'}
              placeholder='Email'
              onChange={(e) => form.handleChangeField('email')(e.target.value)}
              value={form.formData.email}
              error={form.formData.email && form.errors.email}
            />
            <TextInput
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
              onChange={(e) => form.handleChangeField('password')(e.target.value)}
              value={form.formData.password}
              error={form.formData.password && form.errors.password}
            />
            <TextInput
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
              onChange={(e) => form.handleChangeField('confirmPassword')(e.target.value)}
              value={form.formData.confirmPassword}
              error={form.formData.confirmPassword && form.errors.confirmPassword}
            />
          </div>
          <Button
            className='flex items-center justify-center mx-auto h-10 w-full'
            type='submit'
            disabled={!form.isValid && !isLoading}
          >
            {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </Button>
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
