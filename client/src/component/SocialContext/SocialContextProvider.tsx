import { createContext, useState } from "react";

type dataType = {
  email: string;
  picture: string;
  name: string;
  family_name: string;
  given_name: string;
};
type dataResponse = {
  user: dataType;
  isSocialLogin: boolean;
};
type SocialContextType = {
  data: dataResponse | null;
  setData: (data: dataResponse | null) => void;
};

export const SocialContext = createContext<SocialContextType>({
  data: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData: () => {},
});

function SocialContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<dataResponse | null>(null);

  return (
    <SocialContext.Provider value={{ data, setData }}>
      {children}
    </SocialContext.Provider>
  );
}

export default SocialContextProvider;
