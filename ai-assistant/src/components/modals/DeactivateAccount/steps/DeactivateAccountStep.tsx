'use client';

import { FC, SetStateAction } from 'react';
import Button from '@/components/ui/Button/Button';

const DeactivateAccountStep: FC<{ onClose: () => void, setStep: (value: SetStateAction<'verrify' | 'success' | 'deactivate'>) => void }> = ({ onClose, setStep }) => {
    return (
        <div className='flex flex-col flex-1 gap-[10px]'>
            <div className='text-[24px] font-bold'>Deactivate Your Account</div>
            <div className='text-[15px] font-[500] text-lighterAluminum'>
                Temporary hide your profile and pause notifications. You can reactivate your account anytime by logging back in.
            </div>
            <div className='flex flex-col gap-[8px] text-[15px] font-[500] text-lighterAluminum'>
                <div>While your account is deacrivated:</div>
                <ul className='flex flex-col gap-[2px] list-disc pl-5'>
                    <li>Your profile will be hidden</li>
                    <li>You won’t recieve notifications</li>
                    <li>You won’t appear in search</li>
                </ul>
            </div>
            <div className='flex justify-end gap-[16px] mt-auto'>
                <Button
                    ghost={true}
                    type='button'
                    onClick={() => onClose()}
                    className='w-[165.5px] h-[44px] backdrop-blur-[100px] py-[10px] px-[24px] text-white' >
                    Cancel
                </Button>
                <Button className='w-[165.5px] h-[44px] p-[10px]' type='submit' onClick={() => setStep('verrify')}>Continue</Button>
            </div>
        </div>
    )
}

export default DeactivateAccountStep;