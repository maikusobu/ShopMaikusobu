import { createContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { checkLogin } from "../../app/thunkDispatch/thunkLogin";
import { AnyAction } from "@reduxjs/toolkit";
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
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const SocialContext = createContext<SocialContextType>({
  data: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setData: () => {},
});

function SocialContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<dataResponse | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(checkLogin() as unknown as AnyAction);
  }, [dispatch]);
  return (
    <SocialContext.Provider value={{ data, setData }}>
      {children}
    </SocialContext.Provider>
  );
}

export default SocialContextProvider;
