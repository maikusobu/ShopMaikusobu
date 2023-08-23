import { createContext, useState } from "react";

export type ErrorContextType = {
  message: string;
};

type ErrorContextValue = {
  data: string | null;
  error: ErrorContextType | null;
  setError: (error: ErrorContextType | null) => void;
  setData: (data: string | null) => void;
};

export const ErrorContext = createContext<ErrorContextValue>({
  error: null,
  data: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setError: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData: () => {},
});

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<ErrorContextType | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError, data, setData }}>
      {children}
    </ErrorContext.Provider>
  );
};
export default ErrorProvider;
