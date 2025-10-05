'use client';

import Paper from '@/components/ui/Paper/Paper';
import { FC, SetStateAction, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { SuccessStep } from '@/components/SuccessStep/SuccessStep';
import VerifyStep from '@/components/VerifyStep/VerifyStep';
import ChangeMethodStep from './steps/ChangeMethodStep';

interface TwoFactorCardProps {
    onClose: () => void;
}

interface ChangeMethodStepsProps {
    step: 'change_method' | 'verrify' | 'success';
    setStep: (value: SetStateAction<'change_method' | 'verrify' | 'success'>) => void;
    onClose: () => void;
}

type TModalVariant = 'phone' | 'email';

const validCode = '111111';

export function maskPhoneNumber(phoneNumber: string): string {
    const phone = phoneNumber.trim();
    const hasPlus = phone.startsWith('+');
    const digits = phone.replace(/\D/g, '');

    if (digits.length < 4) return phoneNumber;

    const firstTwo = digits.slice(0, 2);
    const lastTwo = digits.slice(-2);
    const middle = digits.slice(2, -2);

    const groups: string[] = [];

    if (middle.length >= 2) {
        groups.push('**');
        let middleRest = middle.slice(2);
        while (middleRest.length > 0) {
            if (middleRest.length > 3) {
                groups.push('***');
                middleRest = middleRest.slice(3);
            } else if (middleRest.length === 1) {
                groups.push('*');
                middleRest = '';
            } else {
                groups.push('*'.repeat(middleRest.length));
                middleRest = '';
            }
        }
    } else if (middle.length > 0) {
        groups.push('*'.repeat(middle.length));
    }

    const maskedMiddle = groups.join(' ');
    const prefix = hasPlus ? '+' : '';
    return `${prefix}${firstTwo} ${maskedMiddle} ${lastTwo}`;
}
export type TSelectedMethod = 'email' | 'phone';

const ChangeMethodSteps: FC<ChangeMethodStepsProps> = ({ step, setStep, onClose }) => {
    const [selected, setSelected] = useState<TSelectedMethod>('email');
    const [codeError, setCodeError] = useState<string>('');
    const phoneNumber = useAppSelector((state) => state.settings.phone);
    const email = useAppSelector((state) => state.settings.email);

    const VerifySubmitNewEmail = (code: string) => {
        if (code !== validCode) {
            setCodeError('Code is invalid');
            return;
        }
        setStep('success');
    };

    const description: Record<TModalVariant, React.ReactNode> = {
        email: (
            <p className="text-[15px] font-normal text-lighterAluminum mb-6 text-left">
                We&apos;ve sent a 6-digit code to your email:
                <br />
                <span className="text-white">{email}.</span>
            </p>
        ),
        phone: (
            <p className="text-[15px] font-normal text-lighterAluminum mb-6 text-left">
                We’ve sent a 6-digit code to phone number:
                <br />
                <span className="text-white">{maskPhoneNumber(phoneNumber)}.</span>
            </p>
        ),
    };

    switch (step) {
        case 'change_method':
            return (
                <ChangeMethodStep onClose={onClose} setSelected={setSelected} selected={selected} setStep={setStep} phoneNumber={phoneNumber} />
            );
        case 'verrify':
            return (
                <div className='flex flex-col h-full'>
                    <VerifyStep
                        title={'Verify New Method'}
                        description={description[selected]}
                        onBack={() => setStep('change_method')}
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
                        title='Two-Factor Method Updated'
                        description='Your 2FA method has been successfully updated. All future security codes will be sent to your selected option.'
                        onSubmit={() => onClose()}
                    />
                </div>
            );
        default:
            return null;
    }
}
const TwoFactorModalCard: FC<TwoFactorCardProps> = ({ onClose }) => {
    const [step, setStep] = useState<'change_method' | 'verrify' | 'success'>('change_method');

    return (
        <Paper className='w-[393px] h-[448px] rounded-[24px] p-[24px] gap-[24px] flex flex-col border-none'>
            <ChangeMethodSteps step={step} setStep={setStep} onClose={onClose} />
        </Paper>
    )
};

export default TwoFactorModalCard;