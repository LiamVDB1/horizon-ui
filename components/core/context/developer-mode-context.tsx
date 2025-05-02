'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface DeveloperModeContextProps {
  isDeveloperMode: boolean;
  toggleDeveloperMode: () => void;
}

const DeveloperModeContext = createContext<DeveloperModeContextProps | undefined>(
  undefined
);

interface DeveloperModeProviderProps {
  children: ReactNode;
}

export const DeveloperModeProvider = ({ children }: DeveloperModeProviderProps) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  const toggleDeveloperMode = useCallback(() => {
    setIsDeveloperMode((prev) => !prev);
  }, []);

  return (
    <DeveloperModeContext.Provider value={{ isDeveloperMode, toggleDeveloperMode }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};

export const useDeveloperMode = () => {
  const context = useContext(DeveloperModeContext);
  if (context === undefined) {
    throw new Error('useDeveloperMode must be used within a DeveloperModeProvider');    
  }
  return context;
}; 