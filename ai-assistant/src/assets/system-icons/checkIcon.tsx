import React from 'react';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        viewBox="0 0 24 24"
    >
        <path d="M6 13l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default CheckIcon;