import PostIcon from '@/assets/input/post.svg';
import Button from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input';

import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { Dispatch, FC, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { IEmails, TSteps } from '../../ChangeEmail/ChangeEmail';
import { AuthService } from '@/services/AuthService';

interface IFormData {
  currentEmail: string;
  newEmail: string;
  confirmNewEmail: string;
}

const initialState: IFormData = {
  currentEmail: '',
  newEmail: '',
  confirmNewEmail: '',
};

interface ChangeEmailStepProps {
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
  setEmails: Dispatch<SetStateAction<IEmails>>;
}

export const ChangeEmailStep: FC<ChangeEmailStepProps> = ({
  setStep,
  onClose,
  setEmails,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: initialState,
  });

  const onSubmit = async (data: IFormData) => {
    try {
      const res = await AuthService.emailChangeVerification({
        current_email: data.currentEmail,
        new_email: data.newEmail,
      });
      setEmails({
        current: data.currentEmail,
        new: data.newEmail,
        token: res.data.token,
      });
      setStep('verify_current_email');
    } catch (e) {
      console.error(e);
    }
  };

  const newEmail = watch('newEmail');
  const emailIcon = (
    <PostIcon width={20} height={20} className='text-lighterAluminum mr-2' />
  );

  return (
    <div className='flex flex-col items-start justify-start'>
      <h2 className='font-semibold text-2xl mb-6'>Change Email Address</h2>
      <p className='text-[15px] text-lighterAluminum font-normal mb-6'>
        To update your email, we’ll need to verify both your current and new
        address.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full flex flex-col gap-4'
      >
        <Input
          leftIcon={emailIcon}
          placeholder='Current email'
          {...register('currentEmail', {
            required: 'Current email is required',
            pattern: {
              value: REGULAR_EXPRESSIONS.email,
              message: 'Invalid email address',
            },
          })}
          error={errors.currentEmail?.message}
        />
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
        <Input
          leftIcon={emailIcon}
          placeholder='Confirm new email'
          {...register('confirmNewEmail', {
            required: 'Please confirm your new email',
            validate: (value: string) =>
              value === newEmail || 'Emails do not match',
          })}
          error={errors.confirmNewEmail?.message}
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
