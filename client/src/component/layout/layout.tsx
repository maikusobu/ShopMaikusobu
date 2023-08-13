import React, { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { checkLogin } from "../../app/thunkDispatch/thunkLogin";
import { AnyAction } from "@reduxjs/toolkit";
type layoutProp = {
  children: React.ReactNode;
};
// nothing special about this component, just act as wrapper
function Layout({ children }: layoutProp) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(checkLogin() as unknown as AnyAction);
  }, [dispatch]);

  return <div className="layout">{children}</div>;
}
export default Layout;
