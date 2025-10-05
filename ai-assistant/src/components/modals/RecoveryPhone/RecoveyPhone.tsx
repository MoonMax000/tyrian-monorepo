'use client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Paper from '../../ui/Paper/Paper';

import VerifyStep from '@/components/VerifyStep/VerifyStep';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import { ChangePhoneStep } from './steps/RecoveyPhoneStep';

export type TSteps = 'add_recovery_phone' | 'verify_current_phone' | 'success';

interface RecoveryPhoneProps {
  onClose: () => void;
}
interface PhoneStepsProps {
  step: TSteps;
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
}

const validCode = '111111';

const PhoneSteps: FC<PhoneStepsProps> = ({ step, setStep, onClose }) => {
  const [phone, setPhone] = useState<string>('');
  const [codeEror, setCodeError] = useState<string>('');

  const VerifySubmitNewPhone = (code: string) => {
    if (code !== validCode) {
      setCodeError('Code is invalid');
      return;
    }
    setStep('success');
  };

  switch (step) {
    case 'add_recovery_phone':
      return (
        <ChangePhoneStep
          setStep={setStep}
          onClose={onClose}
          setPhone={setPhone}
        />
      );
    case 'verify_current_phone':
      return (
        <VerifyStep
          title='Verify Recovery Number'
          description={
            <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
              We’ve sent a 6-digit code to: <span>{phone}</span>.
            </p>
          }
          onBack={() => setStep('add_recovery_phone')}
          handleSubmit={VerifySubmitNewPhone}
          setCodeError={setCodeError}
          onResendCode={() => {}}
          codeError={codeEror}
        />
      );

    case 'success':
      return (
        <SuccessStep
          title='Recovery Phone Added'
          description='Your phone number has been successfully verified and saved.'
          onSubmit={onClose}
        />
      );
  }
};

export const RecoveryPhone: FC<RecoveryPhoneProps> = ({ onClose }) => {
  const [step, setStep] = useState<TSteps>('add_recovery_phone');
  return (
    <Paper className='w-[393px] h-[401px] px-[26px] py-6 border-none'>
      <PhoneSteps step={step} setStep={setStep} onClose={onClose} />
    </Paper>
  );
};
