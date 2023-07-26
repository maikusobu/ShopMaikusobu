import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { checkLogin } from "../../app/thunkDispatch/thunkLogin";
type layoutProp = {
  children: React.ReactNode;
};
function Layout({ children }: layoutProp) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch<any>(checkLogin());
  }, [dispatch]);
  return <div className="layout">{children}</div>;
}
export default Layout;
