import Paper from '@/components/Paper';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import IconEye from '@/assets/icons/eyes/icon-eye-open.svg';
import IconEyeClose from '@/assets/icons/eyes/icon-eye-close.svg';
import { FormEvent, useState } from 'react';
import SectionWrapper from '../SectionWrapper';

interface FormState {
  password: string;
  newPassword: string;
  repeatPassword: string;
}

type PasswordHideState = Record<keyof FormState, boolean>;

const formBlocks: { label: string; key: keyof FormState }[] = [
  { label: 'Current Password', key: 'password' },
  { label: 'New Password', key: 'newPassword' },
  { label: 'Confirm Password', key: 'repeatPassword' },
];

const ChangePassword = () => {
  const [formState, setFormState] = useState<FormState>({} as FormState);
  const [passwordHideState, setPasswordHideState] = useState<PasswordHideState>(
    {} as PasswordHideState,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.password || !formState.repeatPassword || !formState.newPassword) {
      return alert('Не все обязательные поля заполнены');
    }

    if (formState.password !== formState.repeatPassword) {
      return alert('Пароли не совпадают');
    }

    // todo response
  };

  return (
    <SectionWrapper>
      <Paper className='!px-0 pb-6 h-min'>
        <h1 className='text-h4 pl-6 border-b border-onyxGrey pb-4'>Change Password</h1>

        <div className='border-t-2 border-blackedGray'>
          <form className='px-6 flex flex-col gap-7' onSubmit={handleSubmit}>
            <div>
              {formBlocks.map((formItem) => (
                <div
                  key={formItem.key}
                  className='py-5 border-b border-onyxGrey grid grid-cols-[180px,1fr] justify-between gap-[15%]'
                >
                  <p className='text-body-15 opacity-[48%]'>{formItem.label}</p>

                  <div className='flex items-center gap-2'>
                    <Input
                      inputWrapperClassName='bg-moonlessNight'
                      value={formState[formItem.key]}
                      onChange={(e) => {
                        setFormState((prev) => ({ ...prev, [formItem.key]: e.target.value }));
                      }}
                      type={passwordHideState[formItem.key] ? 'text' : 'password'}
                      icon={
                        <button
                          type='button'
                          aria-label={
                            passwordHideState[formItem.key] ? 'Показать пароль' : 'Скрыть пароль'
                          }
                          onClick={() => {
                            setPasswordHideState((prev) => ({
                              ...prev,
                              [formItem.key]: !prev[formItem.key],
                            }));
                          }}
                        >
                          {passwordHideState[formItem.key] ? <IconEyeClose /> : <IconEye />}
                        </button>
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className='flex justify-end gap-6'>
              <Button
                className='!w-[180px] h-10'
                variant='transparent'
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='!w-[180px] h-10'
                disabled={!formState.password || !formState.password || !formState.repeatPassword}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Paper>
    </SectionWrapper>
  );
};

export default ChangePassword;
