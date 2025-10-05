import React from 'react';

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    className?: string;
    headIcon?: React.ReactNode;
    onChange?: (value: string) => void;
    type?: string;
    endIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder = "Enter text...",
    value,
    onChange,
    className,
    type = "text",
    endIcon,
    headIcon
}) => {

    return (
        <div className={className}>
            {label && (
                <div className="font-semibold text-lighterAluminum text-[12px] leading-4 uppercase mb-1">
                    {label}
                </div>
            )}
            <div className="relative">
                 {headIcon && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-lighterAluminum pointer-events-none">
                        {headIcon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`px-[16px] h-11 py-[12px] w-full text-[15px] font-medium text-lighterAluminum backdrop-blur-[100%] gap-[8px] rounded-[8px] leading-[20px] border-regaliaPurple border border-solid opacity-100 bg-custom-dark focus:outline-none focus:border-regaliaPurple
                        ${endIcon ? 'pr-12' : ''}
                        ${headIcon ? 'pl-[39px]' : ''}
                    `}
                />
                {endIcon && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center text-lighterAluminum pointer-events-none">
                        {endIcon}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Input;