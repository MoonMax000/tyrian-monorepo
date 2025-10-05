'use client';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import Paper from '../../ui/Paper/Paper';

import VerifyStep from '@/components/VerifyStep/VerifyStep';
import { useAppDispatch } from '@/store/hooks';
import { changeEmail } from '@/store/slices/userSettingsSlice';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import { ChangeEmailStep } from './steps/ChangeEmailStep';
import { AuthService } from '@/services/AuthService';

export type TSteps =
  | 'change_email'
  | 'verify_current_email'
  | 'verify_new_email'
  | 'success';

interface ChangeEmailProps {
  onClose: () => void;
}
interface EmailStepsProps {
  step: TSteps;
  setStep: Dispatch<SetStateAction<TSteps>>;
  onClose: () => void;
}

export interface IEmails {
  current: string;
  new: string;
  token?: string;
}

const EmailSteps: FC<EmailStepsProps> = ({ step, setStep, onClose }) => {
  const dispatch = useAppDispatch();
  const [emails, setEmails] = useState<IEmails>({
    current: '',
    new: '',
    token: undefined,
  });
  const [codeEror, setCodeError] = useState<string>('');

  const VerifySubmitNewEmail = async (code: string) => {
    try {
      await AuthService.emailChange({ code });
      setStep('success');
      dispatch(changeEmail(emails.new));
    } catch (e) {
      setCodeError('Code is invalid');
    }
  };

  switch (step) {
    case 'change_email':
      return (
        <ChangeEmailStep
          setStep={setStep}
          onClose={onClose}
          setEmails={setEmails}
        />
      );
    case 'verify_current_email':
      return (
        <VerifyStep
          title='Verify Current Email'
          description={`We’ve sent a 6-digit code to your current email: ${emails.current}`}
          onBack={() => setStep('change_email')}
          handleSubmit={async (code) => {
            try {
              await AuthService.emailChangeConfirm({
                token: emails.token!,
                code,
              });
              setStep('verify_new_email');
            } catch (e) {
              setCodeError('Code is invalid');
            }
          }}
          setCodeError={setCodeError}
          onResendCode={() =>
            AuthService.emailChangeVerification({
              current_email: emails.current,
              new_email: emails.new,
            })
          }
          codeError={codeEror}
        />
      );
    case 'verify_new_email':
      return (
        <VerifyStep
          title='Verify New Email'
          description={`We’ve sent a 6-digit code to your new email: ${emails.new}`}
          onBack={() => setStep('verify_current_email')}
          handleSubmit={VerifySubmitNewEmail}
          onResendCode={() =>
            AuthService.emailChangeVerification({
              current_email: emails.current,
              new_email: emails.new,
            })
          }
          setCodeError={setCodeError}
          codeError={codeEror}
          initialCode={['', '', '', '', '', '']}
        />
      );
    case 'success':
      return (
        <SuccessStep
          title='Email Changed'
          description='Your email address has been successfully changed.'
          onSubmit={onClose}
        />
      );
  }
};

export const ChangeEmail: FC<ChangeEmailProps> = ({ onClose }) => {
  const [step, setStep] = useState<TSteps>('change_email');
  return (
    <Paper className='w-[393px] px-[26px] py-6 border-none'>
      <EmailSteps step={step} setStep={setStep} onClose={onClose} />
    </Paper>
  );
};
