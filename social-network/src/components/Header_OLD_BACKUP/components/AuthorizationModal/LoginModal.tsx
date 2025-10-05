import React, { useMemo, useState } from 'react';
import { useAuthMutation } from '@/store/api';
import Button from '@/components/UI/Button/Button';
import TextInput from '@/components/UI/TextInput';
import { TAuthorizationModal } from '../../Header';
import { IValidationSchema, useForm } from '@/utilts/hooks/useForm';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/constants/cookies';
import { setCookie } from '@/utilts/cookie';
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
  ],
} as IValidationSchema;

interface FormState {
  email: string;
  password: string;
}

const initFormState: FormState = {
  email: '',
  password: '',
};

const LoginModal: React.FC<{
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ onModalChange }) => {
  const [auth, { isLoading }] = useAuthMutation();
  const [shownPasword, setShownPassword] = useState<boolean>(false);

  const toogleShown = () => {
    setShownPassword((prev) => !prev);
  };

  const form = useForm<FormState>(
    async (data) => {
      try {
        const resp = await auth({
          identity: data.email,
          password: data.password,
        }).unwrap();
        setCookie(ACCESS_TOKEN_COOKIE_NAME, resp.data.token);
        onModalChange(null);
        window.location.reload();
      } catch (error) {
        form.setExternalErrors({ email: 'Не верная почта или пароль' });
        console.log('Произошла ошибка', error);
      }
    },
    validation,
    initFormState,
  );

  const emailError = useMemo(
    () => form.formData['email']?.toString() && form.errors['email'],
    [form.errors, form.formData],
  );

  const passwordError = useMemo(
    () => form.formData['password']?.toString() && form.errors['password'],
    [form.errors, form.formData],
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <div className='flex flex-col gap-4 mb-6'>
        <span className='text-red text-right text-sm'>
          {emailError ? emailError : passwordError ? passwordError : <>&nbsp;</>}
        </span>
        <TextInput
          beforeIcon={
            <div className='opacity-45 mr-2'>
              <PostIcon width={20} height={20} className='text-white ' />
            </div>
          }
          placeholder='Email'
          inputWrapperClassName={'min-h-11 border-0'}
          onChange={(event) => form.handleChangeField('email')(event.target.value)}
          value={form.formData['email']}
        />
        <div>
          <TextInput
            placeholder='Password'
            beforeIcon={
              <div className='opacity-45 mr-2'>
                <KeyIcon width={16} height={16} className='text-white ' />
              </div>
            }
            icon={
              <div className='opacity-45 ml-1' onClick={toogleShown}>
                {shownPasword ? (
                  <EyeCloseIcon width={24} height={24} className='text-white ' />
                ) : (
                  <EyeIcon width={24} height={24} className='text-white' />
                )}
              </div>
            }
            type={shownPasword ? 'text' : 'password'}
            inputWrapperClassName={'min-h-11 border-0'}
            onChange={(event) => form.handleChangeField('password')(event.target.value)}
            value={form.formData['password']}
          />
        </div>
      </div>
      <Button
        className='flex items-center justify-center mx-auto h-10 w-full'
        type='submit'
        disabled={!form.isValid || isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </Button>
      <div className='flex flex-col justify-center'>
        <button
          type='button'
          className='text-sm font-bold text-purple mt-4  underline'
          onClick={() => onModalChange('recovery')}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
};

export default LoginModal;
