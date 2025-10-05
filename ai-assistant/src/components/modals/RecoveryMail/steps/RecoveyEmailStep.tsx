import PostIcon from '@/assets/input/post.svg';
import Button from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input';

import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { Dispatch, FC, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { TSteps } from '../RecoveyEmail';

interface IFormData {
  newEmail: string;
}

const initialState: IFormData = { newEmail: '' };

interface RecoveryEmailStepProps {
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
  setEmail: Dispatch<SetStateAction<string>>;
  handleAdd: () => void;
}

export const RecoveryEmailStep: FC<RecoveryEmailStepProps> = ({
  setStep,
  onClose,
  setEmail,
  handleAdd,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: initialState,
  });

  const onSubmit = (data: IFormData) => {
    setStep('verify_email');
    setEmail(data.newEmail);
    handleAdd();
  };
  const emailIcon = (
    <PostIcon width={20} height={20} className='text-lighterAluminum mr-2' />
  );

  return (
    <div className='h-full flex flex-col items-start '>
      <h2 className='font-semibold text-2xl mb-6'>Add Recovery Email</h2>
      <p className='text-[15px] text-lighterAluminum font-normal mb-6 text-left'>
        Set a backup email to help you recover your account if you lose access
        to your primary one.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full h-full flex flex-col gap-4 justify-between'
      >
        <Input
          leftIcon={emailIcon}
          placeholder='New email'
          {...register('newEmail', {
            required: 'New email is required',
            pattern: {
              value: REGULAR_EXPRESSIONS.email,
              message: 'Invalid email address',
            },
          })}
          error={errors.newEmail?.message}
        />

        <div className='flex gap-4 justify-between'>
          <Button
            ghost
            className='text-lighterAluminum w-full'
            type='button'
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button className='w-full' type='submit'>
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};
