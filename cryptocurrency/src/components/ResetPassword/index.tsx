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

interface FormState {
  password: string;
  confimPaswword: string;
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

const ResetPasword: FC<IResetPaswordProps> = ({ token, uid }) => {
  const [formState, setFormState] = useState<FormState>({} as FormState);
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
        new_password: formState.password,
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
      console.log(data?.status);
      switch (data?.status) {
        case 201:
          alert('ваш пароль изменен');
          window.close();
          break;
        case 204:
          alert('ваш пароль изменен');
          window.close();
          break;
        default:
          alert('Пароль слишком короткий или ссылка просрочена попробуйте,получить новую');
      }
    },
    onError: (error) => {
      console.log('invalid CurrentPassword', error);
    },
  });

  const handleReset = () => {
    if (formState.password !== formState.confimPaswword) {
      alert('Пароли не совпадают');
      return;
    }
    mutateAsync();
  };

  return (
    <Modal isOpen={true} contentClassName='!pr-0 !overflow-hidden'>
      <div className='grid grid-cols-2 items-center'>
        <div className='px-6 py-[70px]'>
          <h2 className='text-2xl font-semibold text-center mb-6'>Восстановление пароля</h2>

          <p className='mb-6 text-basic opacity-[48%]'>
            Ваш новый пароль не должен совпадать с ранее использованными паролями
          </p>
          <div>
            <div className='flex flex-col gap-4 mb-6'>
              <Input
                label='Новый пароль'
                inputWrapperClassName='h-10'
                onChange={(e) => setFormState((prev) => ({ ...prev, password: e.target.value }))}
                value={formState.password}
                type={isShown.password ? 'text' : 'password'}
                icon={
                  <button type='button' onClick={() => ToogleIsShown('password')}>
                    {isShown.password ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
              />
              <Input
                label='Повторите пароль'
                inputWrapperClassName='h-10'
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, confimPaswword: e.target.value }))
                }
                value={formState.confimPaswword}
                type={isShown.confimPaswword ? 'text' : 'password'}
                icon={
                  <button type='button' onClick={() => ToogleIsShown('confimPaswword')}>
                    {isShown.confimPaswword ? <IconEyeClose /> : <IconEyeOpen />}
                  </button>
                }
              />
            </div>
            <Button
              className='mx-auto max-w-[180px] h-10 w-full'
              type='submit'
              disabled={!(formState.password && formState.confimPaswword) || isPending}
              onClick={handleReset}
            >
              Изменить пароль
            </Button>
          </div>
        </div>

        <div
          className='bg-[#FFFFFF05] backdrop-blur-[240px] py-[70px] px-6 rounded-r-xl bg-cover h-full'
          style={{ backgroundImage: `url(${authorizationAdvertisementBackground.src})` }}
        >
          <h2 className='text-title text-center'>
            Присоединяйся к 100 000+ комьюнити AXA Stocks{' '}
          </h2>
          <p className='mt-4 text-[15px] leading-5 opacity-[48%] font-bold text-center'>
            Станьте частью активного сообщества инвесторов и трейдеров. Мы предлагаем различные
            тарифы, включая 7 дней бесплатного доступа! Откройте все функции платформы, получайте
            советы и делитесь опытом. Улучшайте свои инвестиционные навыки с AXA Stocks!
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ResetPasword;
