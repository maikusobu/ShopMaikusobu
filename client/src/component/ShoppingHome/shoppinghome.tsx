import { useEffect } from "react";
import HeaderShopping from "./HeaderShopping/HeaderShopping";
import Layout from "../layout/layout";
import { Outlet } from "react-router-dom";

function ShoppingHome() {
  useEffect(() => {
    document.title = "Shop";
  }, []);
  return (
    <Layout>
      <HeaderShopping />
      <Outlet />
    </Layout>
  );
}

export default ShoppingHome;
