"use client";
import React from 'react';
import Breadcrumbs from '@/components/UI/Breadcrumbs/Base';
import { usePathname } from 'next/navigation';

interface CreateProductLayoutProps {
  children: React.ReactNode;
}

const CreateProductLayout: React.FC<CreateProductLayoutProps> = ({ children }) => {
    const path = usePathname();
    const breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Creating new product', href: path }];

    return (
        <div className="mt-[74px] flex flex-col items-center">
            <Breadcrumbs breadcrumbItems={breadcrumbs} className='mb-6 self-start' />
            <div className='w-[714px]'>{children}</div>
        </div>
    );
};

export default CreateProductLayout;
