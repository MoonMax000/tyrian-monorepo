import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PortfolioContextType {
  currentPortfolioId: string | null;
  setCurrentPortfolioId: (id: string | null) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPortfolioId, setCurrentPortfolioId] = useState<string | null>(() => {
    return localStorage.getItem('current_portfolio_id');
  });

  useEffect(() => {
    if (currentPortfolioId) {
      localStorage.setItem('current_portfolio_id', currentPortfolioId);
    } else {
      localStorage.removeItem('current_portfolio_id');
    }
  }, [currentPortfolioId]);

  return (
    <PortfolioContext.Provider value={{ currentPortfolioId, setCurrentPortfolioId }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolioContext = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolioContext must be used within a PortfolioProvider');
  }
  return context;
};
