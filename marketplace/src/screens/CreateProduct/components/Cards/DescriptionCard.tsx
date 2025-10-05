'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Card from '../Card';

const Editor = dynamic(() => import('../Editor'), {
    ssr: false,
    loading: () => <div className="h-32 animate-pulse bg-gray-200 rounded"></div>
});

const DescriptionCard: React.FC = () => {
    return (
        <Card hasOutline title='Description'>
            <Editor />
        </Card>
    );
};

export default DescriptionCard;