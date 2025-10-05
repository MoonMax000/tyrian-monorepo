import { FC, useState } from 'react';
import { setCookie } from '@/utils/cookie';
import { AuthorizationService } from '@/services/AuthorizationService';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import { TAuthorizationModal } from '@/types/authorization';
import { IValidationSchema, useForm } from '@/hooks/useForm';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import PostIcon from '@/assets/icons/input/post.svg';
import KeyIcon from '@/assets/icons/input/key.svg';
import EyeIcon from '@/assets/icons/input/eye.svg';
import EyeCloseIcon from '@/assets/icons/input/closeEye.svg';

const validation = {
  identity: [
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
  identity: string;
  password: string;
}

const initFormState: FormState = {
  identity: '',
  password: '',
};

const LoginModal: FC<{
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ onModalChange }) => {
  const [shownPasword, setShownPassword] = useState<boolean>(false);
  const form = useForm<FormState>(
    async () => {
      try {
        const { data } = await AuthorizationService.login(form.formData);
        setCookie('access-token', data.data.token);
        window.location.reload(); //нужно завести в стейт
        onModalChange(null);
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

  const toogleShown = () => {
    setShownPassword((prev) => !prev);
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <div className='flex flex-col gap-6 mb-6 '>
        <Input
          beforeIcon={
            <div className='opacity-45 mr-2'>
              <PostIcon width={20} height={20} className='text-white ' />
            </div>
          }
          placeholder='Email'
          inputWrapperClassName={'min-h-11 border-0'}
          onChange={(event) => form.handleChangeField('identity')(event.target.value)}
          value={form.formData['identity']}
          error={form.formData['identity']?.toString() && form.errors['identity']}
        />
        <div>
          <Input
            placeholder='Пароль'
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
            error={form.formData['password']?.toString() && form.errors['password']}
            isfillTextWhileError={true}
          />
        </div>
      </div>
      <div className='flex  flex-col items-center justify-center w-full'>
        <Button className='mx-auto min-h-10 w-full' type='submit' disabled={!form.isValid}>
          Войти
        </Button>
        <button
          type='button'
          className='text-sm font-bold text-purple mt-4  underline'
          onClick={() => onModalChange('recovery')}
        >
          Забыли пароль?
        </button>
      </div>
    </form>
  );
};

export default LoginModal;
