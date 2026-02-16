import { createContext, useContext, useState, ReactNode } from 'react';

interface DivisionContextType {
  currentDivision: string | null;
  setCurrentDivision: (division: string | null) => void;
}

const DivisionContext = createContext<DivisionContextType>({
  currentDivision: null,
  setCurrentDivision: () => {},
});

interface DivisionProviderProps {
  children: ReactNode;
}

export function DivisionProvider(props: DivisionProviderProps) {
  const [currentDivision, setCurrentDivision] = useState<string | null>(null);

  const value: DivisionContextType = {
    currentDivision,
    setCurrentDivision,
  };

  return (
    <DivisionContext.Provider value={value}>
      {props.children}
    </DivisionContext.Provider>
  );
}

export function useDivision(): DivisionContextType {
  const context = useContext(DivisionContext);
  if (!context) {
    throw new Error('useDivision must be used within DivisionProvider');
  }
  return context;
}