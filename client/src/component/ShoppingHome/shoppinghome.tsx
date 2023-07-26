import ContentShow from "./ContentShow/ContentShow";
import HeaderShopping from "./HeaderShopping/HeaderShopping";
import Layout from "../layout/layout";
function ShoppingHome() {
  return (
    <Layout>
      <HeaderShopping />
      <ContentShow />
    </Layout>
  );
}

export default ShoppingHome;
