import { createContext, useContext, useState, type ReactNode } from "react";

interface ErrorContextType {
  error: { status: number; message: string } | null;
  setError: (error: { status: number; message: string } | null) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error("useError must be used within ErrorProvider");
  return context;
};
