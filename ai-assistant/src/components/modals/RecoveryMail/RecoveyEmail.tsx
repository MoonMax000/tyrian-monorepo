'use client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Paper from '../../ui/Paper/Paper';

import VerifyStep from '@/components/VerifyStep/VerifyStep';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import { RecoveryEmailStep } from './steps/RecoveyEmailStep';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AuthService,
  ChangeFieldsVerificationConfirmParams,
} from '@/services/AuthService';

export type TSteps = 'change_email' | 'verify_email' | 'success';

interface RecoveryEmailProps {
  onClose: () => void;
}
interface EmailStepsProps {
  step: TSteps;
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
}

const EmailSteps: FC<EmailStepsProps> = ({ step, setStep, onClose }) => {
  const [email, setEmail] = useState<string>('');
  const [codeError, setCodeError] = useState<string>('');
  const [token, setToken] = useState('');

  const { data: profile, refetch } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
  });

  const { mutateAsync: getVerificationCode } = useMutation({
    mutationKey: ['changeFieldsVerification'],
    mutationFn: () =>
      AuthService.changeFieldsVerification({
        email: profile?.email,
        fields_to_change: ['backup_email'],
      }),
  });

  const { mutateAsync: confirmVerification } = useMutation({
    mutationKey: ['changeFieldsVerificationConfirm'],
    mutationFn: (body: ChangeFieldsVerificationConfirmParams) =>
      AuthService.changeFieldsVerificationConfirm(body),
  });

  const handleGetRecoveryCode = () => {
    getVerificationCode().then((res) => setToken(res.data.token));
  };

  const verifySubmitNewEmail = (code: string) => {
    confirmVerification({
      token: token,
      code: code,
      new_values: {
        backup_email: email,
      },
    }).then(() => {
      setStep('success');
      refetch();
    });
  };

  switch (step) {
    case 'change_email':
      return (
        <RecoveryEmailStep
          setStep={setStep}
          onClose={onClose}
          setEmail={setEmail}
          handleAdd={handleGetRecoveryCode}
        />
      );
    case 'verify_email':
      return (
        <VerifyStep
          title='Verify Recovery Email'
          description={
            <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left w-full'>
              We’ve sent a 6-digit code to:{' '}
              <span className='text-white'>{email}</span>.
            </p>
          }
          onBack={() => setStep('change_email')}
          handleSubmit={verifySubmitNewEmail}
          setCodeError={setCodeError}
          onResendCode={() => {}}
          codeError={codeError}
        />
      );
    case 'success':
      return (
        <SuccessStep
          title='Recovery Email Added'
          description='Your recovery email has been successfully verified and saved.'
          onSubmit={onClose}
        />
      );
  }
};

export const RecoveryEmail: FC<RecoveryEmailProps> = ({ onClose }) => {
  const [step, setStep] = useState<TSteps>('change_email');
  return (
    <Paper className='w-[393px] h-[401px] px-[26px] py-6 border-none'>
      <EmailSteps step={step} setStep={setStep} onClose={onClose} />
    </Paper>
  );
};
