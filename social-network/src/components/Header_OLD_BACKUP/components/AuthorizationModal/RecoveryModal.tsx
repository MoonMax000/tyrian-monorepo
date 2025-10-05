import Button from '@/components/UI/Button/Button';
import TextInput from '@/components/UI/TextInput';
import { FC, useState } from 'react';
import { TAuthorizationModal } from '../../Header';
import PostIcon from '@/assets/icons/input/post.svg';

interface FormState {
  email: string;
  password: string;
  confimPaswword: string;
}

type ModalSteps = 'sendMassage' | 'successNotification';

const RecoveryModal: FC<{
  onModalChange: (type: TAuthorizationModal) => void;
}> = ({ onModalChange }) => {
  const [formState, setFormState] = useState<FormState>({} as FormState);
  const [step, setStep] = useState<ModalSteps>('sendMassage');

  const handleSendMessage = async () => {
    setStep('successNotification');
  };

  const stepData = {
    sendMassage: {
      notification: 'Enter your email address to reset your password.',
      disabled: !formState.email,
      buttonValue: 'Send message',
      buttonAction: () => handleSendMessage(),
    },
    successNotification: {
      notification:
        'A message with a link to reset your password has been sent to your email.',
      disabled: false,
      buttonValue: 'Continue',
      buttonAction: () => onModalChange(null),
    },
  };

  return (
    <>
      <p className='mb-6 text-basic opacity-[48%]'>{stepData[step].notification}</p>
      <div>
        <div className='flex flex-col gap-4 mb-6'>
          {step === 'sendMassage' && (
            <TextInput
              beforeIcon={
                <div className='opacity-45 mr-2'>
                  <PostIcon width={20} height={20} className='text-white ' />
                </div>
              }
              placeholder='E-mail'
              inputWrapperClassName={'min-h-11 border-0'}
              onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              value={formState.email}
            />
          )}
        </div>
        <Button
          className=' flex items-center justify-center mx-auto max-w-[180px] h-10 w-full'
          type='submit'
          disabled={stepData[step].disabled}
          onClick={stepData[step].buttonAction}
        >
          {stepData[step].buttonValue}
        </Button>
      </div>
    </>
  );
};

export default RecoveryModal;
