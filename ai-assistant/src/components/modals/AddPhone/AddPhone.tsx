'use client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Paper from '../../ui/Paper/Paper';

import VerifyStep from '@/components/VerifyStep/VerifyStep';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import { ChangePhoneStep } from './steps/AddPhoneStep';
import { useAppDispatch } from '@/store/hooks';
import { changePhone } from '@/store/slices/userSettingsSlice';

export type TSteps = 'add_phone' | 'verify_current_phone' | 'success';

interface AddPhoneProps {
  onClose: () => void;
}
interface PhoneStepsProps {
  step: TSteps;
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
}

const validCode = '111111';

const PhoneSteps: FC<PhoneStepsProps> = ({ step, setStep, onClose }) => {
  const dispatch = useAppDispatch();
  const [phone, setPhone] = useState<string>('');
  const [codeEror, setCodeError] = useState<string>('');

  const VerifySubmitNewPhone = (code: string) => {
    if (code !== validCode) {
      setCodeError('Code is invalid');
      return;
    }
    setStep('success');
    dispatch(changePhone(phone));
  };

  switch (step) {
    case 'add_phone':
      return <ChangePhoneStep setStep={setStep} onClose={onClose} setPhone={setPhone} />;
    case 'verify_current_phone':
      return (
        <VerifyStep
          title='Verify Phone Number'
          description={
            <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
              We’ve sent a 6-digit verification code to your phone number:{' '}
              <span className='text-white'>{phone}</span>. Enter the code below to confirm.
            </p>
          }
          onBack={() => setStep('add_phone')}
          handleSubmit={VerifySubmitNewPhone}
          setCodeError={setCodeError}
          onResendCode={() => {}}
          codeError={codeEror}
        />
      );

    case 'success':
      return (
        <SuccessStep
          title='Phone Number Added'
          description='Your phone number has been successfully added and verified. It will be used for security-related actions such as 2FA and recovery.'
          onSubmit={onClose}
        />
      );
  }
};

export const AddPhone: FC<AddPhoneProps> = ({ onClose }) => {
  const [step, setStep] = useState<TSteps>('add_phone');
  return (
    <Paper className='w-[393px] h-[401px] px-[26px] py-6'>
      <PhoneSteps step={step} setStep={setStep} onClose={onClose} />
    </Paper>
  );
};
