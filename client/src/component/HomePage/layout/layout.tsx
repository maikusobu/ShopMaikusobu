import React from "react";
type layoutProp = {
  children: React.ReactNode;
};
function Layout({ children }: layoutProp) {
  return <div className="layout">{children}</div>;
}
export default Layout;
