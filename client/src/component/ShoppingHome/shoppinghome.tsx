import ContentShow from "./ContentShow/ContentShow";
import HeaderShopping from "./HeaderShopping/HeaderShopping";
import Layout from "../layout/layout";
import { Outlet } from "react-router-dom";
function ShoppingHome() {
  return (
    <Layout>
      <HeaderShopping />
      <Outlet />
    </Layout>
  );
}

export default ShoppingHome;
