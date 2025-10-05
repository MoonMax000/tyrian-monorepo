'use client';

import { Dispatch, FC, SetStateAction } from 'react';
import Button from '@/components/ui/Button/Button';
import RadioButton from '@/components/ui/RadioButton/RadioButton';
import { useAppDispatch } from '@/store/hooks';
import { changeSelectedMethod } from '@/store/slices/userSettingsSlice';
import { TSelectedMethod } from '../TwoFactorModalCard';

interface ChangeMethodStepProps {
    onClose: () => void;
    setStep: (value: SetStateAction<'change_method' | 'verrify' | 'success'>) => void;
    setSelected: Dispatch<SetStateAction<TSelectedMethod>>;
    selected: TSelectedMethod;
    phoneNumber: string;
}

const ChangeMethodStep: FC<ChangeMethodStepProps> = ({ onClose, setStep, setSelected, selected, phoneNumber }) => {
    const dispatch = useAppDispatch();
    const handleChange = (value: TSelectedMethod) => {
        setSelected(value);
        dispatch(changeSelectedMethod(value));
    };
    return (
        <>
            <div className='text-[24px] font-bold'>Change 2FA Method</div>
            <div className='text-[15px] font-[500] text-lighterAluminum'>
                Choose how you’d like to recieve verification codes for login and security actions
            </div>
            <RadioButton
                checked={selected === 'email'}
                onChange={() => handleChange('email')}
                name='method'
                value='email'
                label='Email'
                description='Codes will be sent to your verified email address.'
            />
            {phoneNumber
                ? <RadioButton
                    checked={selected === 'phone'}
                    onChange={() => handleChange('phone')}
                    name='method'
                    value='phone'
                    label='Phone Number'
                    description='Codes will be sent via SMS to your verified phone number'
                />
                : <div className='text-[15px] font-bold'>You haven’t added a phone number yet.<br /><span className='text-lightPurple'>Add now.</span></div>
            }
            <div className='flex justify-end gap-[16px] mt-[24px]'>
                <Button
                    ghost={true}
                    type='button'
                    onClick={() => onClose()}
                    className='w-[165.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-white' >
                    Cancel
                </Button>
                <Button className='w-[165.5px] h-[44px] p-[10px]' type='submit' onClick={() => setStep('verrify')}>Continue</Button>
            </div>
        </>
    )
}

export default ChangeMethodStep;