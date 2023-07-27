import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { checkLogin } from "../../app/thunkDispatch/thunkLogin";
type layoutProp = {
  children: React.ReactNode;
};
function Layout({ children }: layoutProp) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch<any>(checkLogin());
  }, [dispatch]);
  return <div className="layout">{children}</div>;
}
export default Layout;
