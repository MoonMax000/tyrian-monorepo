'use client';

import Paper from '@/components/ui/Paper/Paper';
import { FC, SetStateAction, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import VerifyStep from '@/components/VerifyStep/VerifyStep';
import { maskPhoneNumber } from '../TwoFactorAuth/TwoFactorModalCard';
import DeactivateAccountStep from './steps/DeactivateAccountStep';

interface DeactivateAccountProps {
    onClose: () => void;
}
interface DeactivateStepsProps {
    step: 'verrify' | 'success' | 'deactivate';
    setStep: (value: SetStateAction<'verrify' | 'success' | 'deactivate'>) => void;
    onClose: () => void;
}

const validCode = '111111';

const DeactivateSteps: FC<DeactivateStepsProps> = ({ step, setStep, onClose }) => {
    const [codeError, setCodeError] = useState<string>('');
    const phoneNumber = useAppSelector((state) => state.settings.phone);
    const email = useAppSelector((state) => state.settings.email);
    const selectedMethod = useAppSelector((state) => state.settings.selectedMethod);

    const VerifySubmitNewEmail = (code: string) => {
        if (code !== validCode) {
            setCodeError('Code is invalid');
            return;
        }
        setStep('success');
    };

    switch (step) {
        case 'deactivate':
            return (
                <DeactivateAccountStep onClose={onClose} setStep={setStep} />
            );
        case 'verrify':
            return (
                <div className='flex flex-col h-full'>
                    <VerifyStep
                        title={'Verify Your Identity'}
                        description={selectedMethod === 'email'
                            ? <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
                                We&apos;ve sent a 6-digit code to your email:<br />
                                <span className='text-white'>{email}. </span> </p>
                            : <p className='text-[15px] font-normal  text-lighterAluminum mb-6 text-left'>
                                We’ve sent a 6-digit code to phone number: <br />
                                <span className='text-white'>{maskPhoneNumber(phoneNumber)}. </span>
                            </p>
                        }
                        onBack={() => setStep('deactivate')}
                        handleSubmit={VerifySubmitNewEmail}
                        setCodeError={setCodeError}
                        onResendCode={() => { }}
                        codeError={codeError}
                    />
                </div>
            );
        case 'success':
            return (
                <div className='flex flex-col h-full'>
                    <SuccessStep
                        title='Account Deactivated'
                        description='Your account has been deactivated. You can reactivate anytime by logging in again.'
                        onSubmit={() => onClose()}
                    />
                </div>
            );
        default:
            return null;
    }
}
const DeactivateAccountCard: FC<DeactivateAccountProps> = ({ onClose }) => {
    const [step, setStep] = useState<'deactivate' | 'verrify' | 'success'>('deactivate');

    return (
        <Paper className='w-[393px] h-[448px] rounded-[24px] p-[24px] gap-[10px] flex flex-col border-none'>
            <DeactivateSteps step={step} setStep={setStep} onClose={onClose} />
        </Paper>
    )
};

export default DeactivateAccountCard;