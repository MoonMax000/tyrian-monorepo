'use client';

import { useState } from 'react';
import ModalWrapper from '@/components/UI/ModalWrapper/ModalWrapper';
import Input from '@/components/UI/Input/Input';
import Button from '@/components/UI/Button/Button';
import { useChangePasswordMutation } from '@/store/api';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordChangeModal = ({ isOpen, onClose }: PasswordChangeModalProps) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        try {
            const response = await changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                new_password_confirm: confirmPassword
            }).unwrap();

            if (response.status === 'success') {
                onClose();
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                alert('Password successfully changed');
            } else {
                setError(response.message || 'Failed to change password');
            }
        } catch (error: any) {
            if (error.data?.message) {
                setError(error.data.message);
            } else {
                setError('Failed to change password. Please check your current password.');
            }
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Change password"
            className="p-6"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                    <div className="text-red text-sm mb-2">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label className="text-[15px] text-[#87888b]">Current password</label>
                    <Input
                        type="password"
                        placeholder="Enter current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[15px] text-[#87888b]">New password</label>
                    <Input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-[15px] text-[#87888b]">Confirm password</label>
                    <Input
                        type="password"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        type="button"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        type="submit"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </ModalWrapper>
    );
};

export default PasswordChangeModal; 