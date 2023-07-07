import { createContext, useState } from "react";
import type { User } from "../../Types/User";
export type ErrorContextType = {
  message: string;
  field: string;
};

type ErrorContextValue = {
  data: User | null;
  error: ErrorContextType | null;
  setError: (error: ErrorContextType | null) => void;
  setData: (data: User | null) => void;
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
  // eslint-disable-next-line prefer-const
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<ErrorContextType | null>(null);

  return (
    <ErrorContext.Provider value={{ error, setError, data, setData }}>
      {children}
    </ErrorContext.Provider>
  );
};
export default ErrorProvider;
