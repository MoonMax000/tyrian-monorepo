'use client';

import { createContext, useContext, useState } from 'react';

type TAuthorizationModal = 'login' | 'registration' | 'recovery' | null;

interface AuthorizationModalContextType {
  authorizationModalType: TAuthorizationModal;
  setAuthorizationModalType: (type: TAuthorizationModal) => void;
}

const AuthorizationModalContext = createContext<AuthorizationModalContextType | undefined>(undefined);

export const AuthorizationModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [authorizationModalType, setAuthorizationModalType] = useState<TAuthorizationModal>(null);

  return (
    <AuthorizationModalContext.Provider value={{ authorizationModalType, setAuthorizationModalType }}>
      {children}
    </AuthorizationModalContext.Provider>
  );
};

export const useAuthorizationModal = () => {
  const context = useContext(AuthorizationModalContext);
  if (!context) {
    throw new Error('useAuthorizationModal must be used within AuthorizationModalProvider');
  }
  return context;
};
