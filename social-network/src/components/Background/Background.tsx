'use client';
import { FC, ReactNode } from 'react';

export type LayoutVariant = 'primal' | 'secondary' | 'marketplace' | 'socialNetwork'; // добавиить следующие проекты

export const AppBackground: FC<{ children: ReactNode; variant?: LayoutVariant }> = ({
    children,
    variant = 'primal',
}) => {
    switch (variant) {
        case 'primal':
            return <MarketplaceBg>{children}</MarketplaceBg>;
        case 'secondary':
            return <MarketplaceBg>{children}</MarketplaceBg>;
        case 'marketplace':
            return <MarketplaceBg>{children}</MarketplaceBg>;
        case 'socialNetwork':
            return <MarketplaceBg>{children}</MarketplaceBg>;
    }
};

const MarketplaceBg: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-black">
            {children}
        </div>
    );
};