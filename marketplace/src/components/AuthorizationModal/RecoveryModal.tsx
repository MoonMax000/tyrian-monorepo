'use client';
import Input from '../UI/Input';
import Button from '../UI/Button/Button';

import { FC, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AuthorizationService } from '@/services/AuthorizationService';

import PostIcon from '@/assets/icons/input/post.svg';
import { REGULAR_EXPRESSIONS } from '@/constants/regular';
import { TAuthorizationModal } from '@/types/auth';

interface FormState {
  email: string;
}

type ModalSteps = 'sendMassage' | 'successNotification';

const RecoveryModal: FC<{
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ onModalChange }) => {
  const [formState, setFormState] = useState<FormState>({ email: '' });
  const [step, setStep] = useState<ModalSteps>('sendMassage');

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['SendMessage'],
    mutationFn: async () => {
      const loginBody = {
        email: formState.email,
      };

      try {
        const data = await AuthorizationService.requestResetPassword(loginBody);
        console.log(data);
        switch (data.status) {
          case 200:
            setStep('successNotification');
            break;
          case 204:
            setStep('successNotification');
            break;
          case 400:
            alert('Please enter a valid email address.');
            break;
          default:
            alert('Please enter a valid email address.');
            break;
        }
      } catch (error) {
        console.log('Login failed:', error);
      }
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log('invalid CurrentPassword', error);
    },
  });

  const handleSendMessage = async () => {
    mutateAsync();
  };

  const stepData = {
    sendMassage: {
      notification: 'Enter your email address to recover your password.',
      disabled: !REGULAR_EXPRESSIONS.email.test(formState.email) && !!formState.email,
      buttonValue: 'Send a letter',
      buttonAction: () => handleSendMessage(),
    },
    successNotification: {
      notification: 'An email with a link to the password reset form has been sent to your email.',
      disabled: false,
      buttonValue: 'Continue',
      buttonAction: () => onModalChange(null),
    },
  };

  return (
    <>
      <p className='mb-6 text-body-15 opacity-[48%]'>{stepData[step].notification}</p>
      <div>
        <div className='flex flex-col gap-4 mb-6'>
          {step === 'sendMassage' && (
            <Input
              leftIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white ' />
                </div>
              }
              placeholder='E-mail'
              inputWrapperClassName={'min-h-11 border-0'}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              error={stepData[step].disabled ? 'Please enter a valid address' : ''}
              value={formState.email}
            />
          )}
        </div>
        <Button
          className='mx-auto max-w-[180px] min-h-10 w-full'
          disabled={stepData[step].disabled || isPending}
          onClick={stepData[step].buttonAction}
        >
          {stepData[step].buttonValue}
        </Button>
      </div>
    </>
  );
};

export default RecoveryModal;
