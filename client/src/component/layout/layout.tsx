import React from "react";
type layoutProp = {
  children: React.ReactNode;
};
// nothing special about this component, just act as wrapper
function Layout({ children }: layoutProp) {
  return <div className="layout">{children}</div>;
}
export default Layout;
