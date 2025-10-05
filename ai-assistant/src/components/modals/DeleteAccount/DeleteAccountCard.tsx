import { FC, SetStateAction, useState } from 'react';
import Paper from '@/components/ui/Paper/Paper';
import { useAppSelector } from '@/store/hooks';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import VerifyStep from '@/components/VerifyStep/VerifyStep';
import {
  maskPhoneNumber,
  TSelectedMethod,
} from '../TwoFactorAuth/TwoFactorModalCard';
import { SureStep } from '../../SureStep/SureStep';
import DeleteAccountStep from './steps/DeleteAccountStep';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AuthService,
  ConfirmRemoveAccountParams,
} from '@/services/AuthService';
import { useRouter } from 'next/navigation';

interface DeleteAccountProps {
  onClose: () => void;
}
interface DeleteStepsProps {
  step: 'delete' | 'verrify' | 'sure' | 'success';
  setStep: (
    value: SetStateAction<'delete' | 'verrify' | 'sure' | 'success'>,
  ) => void;
  onClose: () => void;
}

type TModalVariant = 'phone' | 'email';

const DeleteSteps: FC<DeleteStepsProps> = ({ step, setStep, onClose }) => {
  const [codeError, setCodeError] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const phoneNumber = useAppSelector((state) => state.settings.phone);
  const selectedMethod = useAppSelector(
    (state) => state.settings.selectedMethod,
  ) as TSelectedMethod;

  const { push } = useRouter();

  const { data: profile } = useQuery({
    queryKey: ['getProfile'],
    queryFn: () => AuthService.getProfile(),
  });

  const { mutate: removeAccountMutation } = useMutation({
    mutationKey: ['deleteVerification'],
    mutationFn: () =>
      AuthService.deleteVerification().then((data) =>
        setVerificationToken(data.data.token),
      ),
  });

  const { mutate: confirmAccountRemove } = useMutation({
    mutationKey: ['confirmAccountRemove'],
    mutationFn: (body: ConfirmRemoveAccountParams) =>
      AuthService.removeAccountConfirmation(body),
  });

  const removeAccount = () => {
    confirmAccountRemove({ token: verificationToken, code: verificationCode });
    setStep('success');
  };

  const verifySubmitPassword = (code: string) => {
    // if (code !== validCode) {
    //   setCodeError('Code is invalid');
    //   return;
    // }
    setStep('sure');
    setVerificationCode(code);
  };

  const handleSuccess = () => {
    onClose();
    push('/');
  };

  const getRemoveAccountCode = () => {
    removeAccountMutation();
  };

  const description: Record<TModalVariant, React.ReactNode> = {
    email: (
      <p className='text-[15px] font-normal text-lighterAluminum mb-6 text-left'>
        We&apos;ve sent a 6-digit code to your email:
        <br />
        <span className='text-white'>{profile?.email}.</span>
      </p>
    ),
    phone: (
      <p className='text-[15px] font-normal text-lighterAluminum mb-6 text-left'>
        We’ve sent a 6-digit code to phone number:
        <br />
        <span className='text-white'>{maskPhoneNumber(phoneNumber)}.</span>
      </p>
    ),
  };

  switch (step) {
    case 'delete':
      return (
        <DeleteAccountStep
          onSubmitStep={getRemoveAccountCode}
          onClose={onClose}
          setStep={setStep}
        />
      );

    case 'verrify':
      return (
        <div className='flex flex-col h-full'>
          <VerifyStep
            title='Verify Your Identity'
            description={description[selectedMethod]}
            onBack={() => setStep('delete')}
            handleSubmit={(code) => verifySubmitPassword(code)}
            setCodeError={setCodeError}
            onResendCode={() => {}}
            codeError={codeError}
          />
        </div>
      );

    case 'sure':
      return (
        <div className='flex flex-col h-full'>
          <SureStep
            title='Are You Absolutely Sure?'
            description={
              <p className='text-[15px] font-normal text-lighterAluminum mb-6 text-left'>
                This is your last chance to cancel.
                <br />
                Clicking “Delete” will permanently erase everything. <br />
                There is <span className='text-white'>no way to undo this</span>
                .
              </p>
            }
            onSubmit={() => removeAccount()}
            onClose={onClose}
          />
        </div>
      );

    case 'success':
      return (
        <div className='flex flex-col h-full'>
          <SuccessStep
            title='Account Deleted'
            description='Your account has been deleted. You can restore it within the next 5 minutes by logging into your account.'
            buttonTitle='Back to Homepage'
            onSubmit={handleSuccess}
          />
        </div>
      );

    default:
      return null;
  }
};
const DeleteAccountCard: FC<DeleteAccountProps> = ({ onClose }) => {
  const [step, setStep] = useState<'delete' | 'verrify' | 'sure' | 'success'>(
    'delete',
  );

  return (
    <Paper className='w-[393px] h-[448px] rounded-[24px] p-[24px] gap-[10px] flex flex-col border-none'>
      <DeleteSteps step={step} setStep={setStep} onClose={onClose} />
    </Paper>
  );
};

export default DeleteAccountCard;
