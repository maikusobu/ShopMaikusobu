/* eslint-disable @typescript-eslint/no-explicit-any */
import Layout from "../../layout/layout";
import HeaderCart from "../Header/HeaderCart";
import CartContent from "../Content/CartContent";
import { useAppDispatch } from "../../../app/hooks";
import { checkLogin } from "../../../app/thunkDispatch/thunkLogin";
import { useEffect } from "react";
function CartPage() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch<any>(checkLogin());
  }, [dispatch]);
  return (
    <Layout>
      <HeaderCart />
      <CartContent />
    </Layout>
  );
}

export default CartPage;
