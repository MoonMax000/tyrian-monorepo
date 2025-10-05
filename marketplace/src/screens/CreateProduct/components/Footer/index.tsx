import Button from '@/components/UI/Button/Button';
import React from 'react';

interface FooterProps {
    onPublish?: () => void;
    onPreview?: () => void;
    onSaveDraft?: () => void;
    className?: string;
    lastSaved?: string | Date;
}

const Footer: React.FC<FooterProps> = ({onPublish, onPreview, onSaveDraft, lastSaved = new Date(), className}) => {
    const formatTime = (date: string | Date): string => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={`flex flex-col gap-4 items-center ${className}`}>
            <div className="flex justify-center gap-4">
                <Button className="py-[3px] font-semibold w-[180px] h-[26px]" variant="secondary" onClick={onSaveDraft}>Save Draft</Button>
                <Button className="py-[3px] font-semibold w-[180px] h-[26px]" variant="secondary" onClick={onPreview}>Preview</Button>
                <Button className="py-[3px] font-semibold w-[180px] h-[26px]" variant="primary" onClick={onPublish}>Publish</Button>
            </div>
            <span className="text-lighterAluminum font-semibold text-[12px] leading-[16px] tracking-[0%]">
                All changes are saved automatically. Last saved at {formatTime(lastSaved)}
            </span>
        </div>
    )
};

export default Footer;