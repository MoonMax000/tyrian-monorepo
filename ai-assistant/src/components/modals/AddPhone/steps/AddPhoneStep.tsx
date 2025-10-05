import PhoneIcon from '@/assets/input/phone.svg';
import Button from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input';

import { Dispatch, FC, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { TSteps } from '../AddPhone';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';

interface IFormData {
  phone: string;
}

const initialState: IFormData = { phone: '' };

interface ChangePhoneStepProps {
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
  setPhone: Dispatch<SetStateAction<string>>;
}

export const ChangePhoneStep: FC<ChangePhoneStepProps> = ({ setStep, onClose, setPhone }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    defaultValues: initialState,
  });

  const onSubmit = (data: IFormData) => {
    setStep('verify_current_phone');
    setPhone(data.phone);
  };

  const emailIcon = <PhoneIcon width={20} height={20} className='text-lighterAluminum mr-2' />;

  return (
    <div className='h-full flex flex-col items-start justify-start'>
      <h2 className='font-semibold text-2xl mb-6'>Add Phone Number</h2>
      <p className='text-[15px] text-lighterAluminum font-normal mb-6'>
        Add a mobile number to enable SMS-based recovery and extra security features.
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='w-full flex flex-col gap-4 justify-between h-full'
      >
        <Input
          leftIcon={emailIcon}
          placeholder='Phone number'
          type='tel'
          inputMode='tel'
          {...register('phone', {
            required: 'Phone number is required',
            pattern: {
              value: REGULAR_EXPRESSIONS.phone,
              message: 'Please enter a valid phone number',
            },
          })}
          error={errors.phone?.message}
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
